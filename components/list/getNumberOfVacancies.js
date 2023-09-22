/* eslint-disable no-await-in-loop */
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'

import queries from './sql.js'
import ListMapper from './mapping.js'
import chalk from '../../shared/chalkColors.js'

import { getCurrentDate } from '../../shared/helpers.js'
import config, { isProduction } from '../../shared/consts.js'
import { sendNoticeToTelegram } from '../../config/telegram.js'

dotenv.config()

export async function getNumberOfVacancies() {
  const jobBoardsRegions = ListMapper.jobBoardsRegions(
    await queries.getJobBoardsRegions()
  )
  chalk.log('Start getNumberOfVacancies')
  const dateStart = new Date()
  const [previousDate] = await queries.getLastDate()

  const emptyWords = await queries.getEmptyWords()
  const dateId = await createAndGetDateOfNewParsing()
  const tools = ListMapper.tools(await queries.getTools())
  for (const jobBoardRegion of jobBoardsRegions) {
    const words = emptyWords
      .filter(w => w.job_boards_regions === jobBoardRegion.id)
      .map(w => w.word)
    const options = [previousDate.iddate, jobBoardRegion.id]
    const previousCounts = ListMapper.getOneCountOfAllTechnology(
      await queries.getOneCountOfAllTechnology(...options)
    )
    for (const tool of tools) {
      const previousItem = previousCounts.find(t => t.idTool === tool.idTool)
      const parameters = [jobBoardRegion, tool, previousItem, dateId, words]
      if (jobBoardRegion.id === 1) await wrapper(getHeadHunter, ...parameters)
      if (jobBoardRegion.id === 2) await wrapper(getLinkedIn, ...parameters)
    }
  }

  await queries.changeStatusOfDate(dateId)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  chalk.log(`Потрачено минут: ${dateEnd}`)
}

async function wrapper(
  function_,
  jobBoardRegion,
  tool,
  previousCounts,
  date,
  words,
  i = 0
) {
  if (i === config.NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов (${tool.nameTool})`)
    sendNoticeToTelegram(`Слишком много неудачных запросов (${tool.nameTool})`)
    return null
  }
  try {
    const previousCount = previousCounts.countOfItem ?? null
    const encodedTool = encodeURIComponent(tool.search_query)

    const { nodeContainCount, id } = jobBoardRegion
    const url = jobBoardRegion.url.replace('<NAME_TOOL!>', encodedTool)
    const count = await function_(url, nodeContainCount, words)

    if (!isNormalCount(count, previousCount) && isProduction) {
      chalk.log('Сильно отличающиеся числа')
      sendNoticeToTelegram(`Сильно отличающиеся числа (${tool.nameTool})`)
    }
    chalk.log(`${tool.nameTool} cur: ${count} prev: ${previousCount}`)
    await queries.setCountsItem(tool.idTool, date, count, id)
    return count
  } catch (error) {
    chalk.error(error)
    return wrapper(
      function_,
      jobBoardRegion,
      tool,
      previousCounts,
      date,
      words,
      i + 1
    )
  }
}

async function getHeadHunter(url, nodeContainCount, words) {
  const resp = await fetch(url)
  const html = await resp.text()

  const indexOfStart = html.indexOf(nodeContainCount)
  const parsedString = html.slice(indexOfStart + 45, indexOfStart + 300)

  if (
    !parsedString.includes('аканс') &&
    !isFixedOrNotFound(parsedString, words)
  ) {
    throw new Error('какая то ошибка')
  }
  if (isFixedOrNotFound(parsedString, words)) return 0

  let currentCount = ''
  for (const char of parsedString) {
    if (!Number.isNaN(+char) && !Number.isNaN(Number.parseFloat(char)))
      currentCount += char
    if (char === '<') break
  }
  return Number(currentCount)
}

async function getLinkedIn(url, nodeContainCount, words) {
  const agent = new HttpsProxyAgent(process.env.PROXY)

  const resp = await fetch(url, { agent })
  const data = await resp.text()

  const index = data.indexOf(nodeContainCount)

  if (
    !data.includes('results-context-header__job-count') &&
    !isFixedOrNotFound(data, words)
  ) {
    console.log('ни результата, ни исправления')
    throw new Error('Ошибка при парсинге')
  }
  if (isFixedOrNotFound(data, words)) return 0

  let res = ''
  for (let i = index; data[i] !== ' '; i++) res += data[i]
  return res.split('>').at(-1).trim().replaceAll(/[+,]/g, '')
}

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.iddate
}

function isFixedOrNotFound(parsedString, words) {
  for (const string of words) {
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
