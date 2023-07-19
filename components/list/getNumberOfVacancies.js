/* eslint-disable no-await-in-loop */
import chalk from 'chalk'
import { HttpsProxyAgent } from 'https-proxy-agent'
import queries from './sql.js'
import { getCurrentDate } from '../../shared/helpers.js'
import { sendMail } from '../../shared/mail.js'
import config from '../../shared/consts.js'

// getNumberOfVacancies() getCountOfItem() isFixedOrNotFound()
export async function getNumberOfVacancies() {
  const jobBoardsAndCounrties = await queries.getJobBoardsAndCounrties()
  console.log(chalk.bgYellow('Start getNumberOfVacancies'))
  const dateStart = new Date()
  const [previousDate] = await queries.getLastDate()
  const previousCounts = await queries.getOneCountOfAllTechnology(
    previousDate.id_date
  )
  const dateId = await createAndGetDateOfNewParsing()

  const tools = await queries.getTools()
  for (const tool of tools) {
    const previousItem = previousCounts.filter(t => t.id_tool === tool.id_tool)
    for (const item of jobBoardsAndCounrties) {
      if (item.job_board_id === 1) {
        await wrapper(getHeadHunter, item, tool, previousItem)
      }
      if (item.job_board_id === 2) {
        await wrapper(getLinkedIn, item, tool, previousItem)
      }
    }
  }

  await queries.changeStatusOfDate(dateId)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  console.log(chalk.bgYellow(`Потрачено минут: ${dateEnd}`))
}

async function wrapper(function_, jobBoardRegions, tool, previousCount, i = 0) {
  if (i === config.NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов (${tool.name_tool})`)
    sendMail({
      subject: `Слишком много неудачных запросов (${tool.name_tool})`,
    })
    return null
  }
  try {
    const count = await function_(tool)
    if (!isNormalCount(count, previousCount)) {
      console.log('Сильно отличающиеся числа')
      sendMail({
        subject: 'Отличающиеся данные',
        text: `Слишком отличающиеся числа у ${tool.name_tool}: прошлое: ${previousCount} текущее: ${count}`,
      })
    }
    console.log(chalk.magenta(tool.name_tool, 'c:', count, 'p:', previousCount))
    await queries.setCountsItem(tool.id_tool, count, jobBoardRegions)
    return count
  } catch (error) {
    console.log(error)
    return wrapper(function_, jobBoardRegions, tool, previousCount, i + 1)
  }
}

async function getHeadHunter(tool, i = 0) {
  // FIX добавить hash table с tools где в качестве ключа будет id, проверить скорость
  // FIX исправить на Promise.all() (в прошлые разы слишком быстро поступали запросы к HH, поэтому ошибка появлялась)

  const encodedTool = encodeURIComponent(tool.search_query)
  const resp = await fetch(`${config.HH_QUERY_SEARCH}${encodedTool}`)
  const html = await resp.text()

  const indexOfStart = html.indexOf(config.HH_HTML_NODE_CONTAINNING_COUNT)
  const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)

  if (!parsedString.includes('аканс') && !isFixedOrNotFound(parsedString)) {
    return getCountOfItem(tool, i + 1)
  }
  if (isFixedOrNotFound(parsedString)) return 0

  let currentCount = ''
  for (const char of parsedString) {
    if (!isNaN(char) && !isNaN(Number.parseFloat(char))) currentCount += char
    if (char === '<') break
  }
  return Number(currentCount)
}
async function getLinkedIn(tool, i = 0) {
  if (i === config.NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов (${tool.name_tool})`)
    sendMail({
      subject: `Слишком много неудачных запросов (${tool.name_tool})`,
    })
    return null
  }

  const proxyHost = '45.91.209.155'
  const proxyPort = 11_110
  const proxyUsername = 'q8DwsT'
  const proxyPassword = 'Cvuz8S'
  const proxyURL = `http://${proxyUsername}:${proxyPassword}@${proxyHost}:${proxyPort}`
  const encodedTool = encodeURIComponent(tool)
  const targetUrl = `https://www.linkedin.com/jobs/search?keywords=${encodedTool}&position=1&pageNum=0`
  const agent = new HttpsProxyAgent(proxyURL)

  try {
    const resp = await fetch(targetUrl, { agent })
    const data = await resp.text()
    const index = data.indexOf('results-context-header__job-count')
    if (!index) throw new Error('index не обнаружен')
    let res = ''
    for (let j = index; data[j] !== '<'; j++) res += data[j]
    return res.split('>').at(-1).trim().replaceAll(/[+,]/g, '')
  } catch (error) {
    console.log(chalk.bgGreen('произошла ошибка'))
    console.log(error)
    await getLinkedIn(tool, i)
  }
}

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.id_date
}

function isFixedOrNotFound(parsedString) {
  for (const string of config.fixedOrNotFound.HeadHunter) {
    if (parsedString.includes(string)) return true
  }
  return false
}

function isNormalCount(currentCount, previousCount) {
  const maxValue = Math.max(currentCount, previousCount)
  const minValue = Math.min(currentCount, previousCount)

  const c = maxValue / 2 < minValue
  return maxValue < config.MIN_VALUE_CHECKING_DIFFERENCES || c
}

export async function canParsing() {
  const now = new Date()
  if (now.getHours() === config.HOURS_OF_START_PARSING) {
    const [lastDate] = await queries.getLastDate()
    return !isSameDay(new Date(lastDate.date_of_completion), now)
  }
  return false
}

function isSameDay(date, date2) {
  const isDay = date.getDay() === date2.getDay()
  const isMonth = date.getMonth() === date2.getMonth()
  const isYear = date.getFullYear() === date2.getFullYear()
  return isDay && isMonth && isYear
}
