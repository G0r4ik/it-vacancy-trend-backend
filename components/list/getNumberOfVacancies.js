import chalk from 'chalk'
import queries from './sql.js'
import { getCurrentDate } from './helprers.js'
import { sendMail } from '../../shared/mail.js'
import {
  HH_HTML_NODE_CONTAINNING_COUNT,
  HOURS_OF_START_PARSING,
  MIN_VALUE_CHECKING_DIFFERENCES,
  NUMBER_OF_FAILED_ATTEMPTS,
  HH_QUERY_SEARCH,
} from '../../shared/consts.js'

export async function getNumberOfVacancies() {
  console.log(chalk.bgYellow('Start getNumberOfVacancies'))
  const dateStart = new Date()
  const [previousDate] = await queries.getLastDate()
  const options = ['Russia', 'HeadHunter', previousDate.id_date]
  const previousCounts = await queries.getOneCountOfAllTechnology(...options)
  const dateId = await createAndGetDateOfNewParsing()
  const tools = await queries.getTools()
  for (const tool of tools) {
    // FIX добавить hash table с tools где в качестве ключа будет id, проверить скорость
    // FIX исправить на Promise.all() (в прошлые разы слишком быстро поступали запросы к HH, поэтому ошибка появлялась)
    const previousItem = previousCounts.find(t => t.id_tool === tool.id_tool)
    const previousCount = previousItem?.count_of_item
    const currentCount = await getCountOfItem(tool)
    if (!isNormalCount(currentCount, previousCount)) {
      console.log('Сильно отличающиеся числа')
      sendMail({
        subject: 'Отличающиеся данные',
        text: `Слишком отличающиеся числа у ${tool.name_tool}: прошлое: ${previousCount} текущее: ${currentCount}`,
      })
    }
    await queries.setCountsItem(tool.id_tool, dateId, currentCount)
    console.log(
      chalk.magenta(tool.name_tool, 'c:', currentCount, 'p:', previousCount)
    )
  }
  await queries.changeStatusOfDate(dateId)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  console.log(chalk.bgYellow(`Потрачено минут: ${dateEnd}`))
}

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.id_date
}

// FIX Add API HH
async function getCountOfItem(tool, i = 0) {
  if (i === NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов (${tool.name_tool})`)
    sendMail({
      subject: `Слишком много неудачных запросов (${tool.name_tool})`,
    })
    return null
  }

  const encodedTool = encodeURIComponent(tool.search_query)
  const resp = await fetch(`${HH_QUERY_SEARCH}${encodedTool}`)
  const html = await resp.text()

  const indexOfStart = html.indexOf(HH_HTML_NODE_CONTAINNING_COUNT)
  const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)

  if (!parsedString.includes('аканс') && !isFixedOrNotFound(parsedString)) {
    return getCountOfItem(tool, i + 1)
  }
  if (isFixedOrNotFound(parsedString)) return 0

  let currentCount = ''
  for (const char of parsedString) {
    if (!isNaN(char) && !isNaN(parseFloat(char))) currentCount += char
    if (char === '<') break
  }
  return Number(currentCount)
}

function isFixedOrNotFound(parsedString) {
  const fixed = parsedString.includes('исправлен')
  const notFound = parsedString.includes('не найдено')
  return fixed || notFound
}

function isNormalCount(currentCount, previousCount) {
  const maxValue = Math.max(currentCount, previousCount)
  const minValue = Math.min(currentCount, previousCount)

  const c = maxValue / 2 < minValue
  return maxValue < MIN_VALUE_CHECKING_DIFFERENCES || c
}

export async function canParsing() {
  const now = new Date()
  if (now.getHours() === HOURS_OF_START_PARSING) {
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
