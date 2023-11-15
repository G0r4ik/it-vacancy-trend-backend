/* eslint-disable no-await-in-loop */
import * as dotenv from 'dotenv'

import {
  getHeadHunter,
  getLinkedIn,
} from '../../shared/parseFunctions/index.js'

import queries from './sql.js'
import ListMapper from '../../shared/mapping.js'
import chalk from '../../shared/chalkColors.js'

import { getCurrentDate } from '../../shared/helpers.js'
import config, { isProduction } from '../../shared/consts.js'
import { sendNoticeToTelegram } from '../../config/telegram.js'

dotenv.config()

export async function getNumberOfVacancies() {
  const dateStart = new Date()
  chalk.log(`Start getNumberOfVacancies ${dateStart}`)

  const [previousDate] = await queries.getLastDate()
  const dateId = await createAndGetDateOfNewParsing()
  const tools = ListMapper.tools(await queries.getTools())

  const jobboards = ListMapper.jobBoardsRegions(
    await queries.getJobBoardsRegions()
  ).filter(i => i.isCompletelyParse)
  // console.log(await queries.getJobBoardsRegions())
  console.log(jobboards)
  for (const jobboard of jobboards) {
    const emptyWordsNotMapped = await queries.getEmptyWords(jobboard.id)
    const emptyWords = emptyWordsNotMapped.map(w => w.word)
    const searchQueries = ListMapper.searchQueries(
      await queries.getSearchQueries(jobboard.id)
    )
    const previousCounts = ListMapper.getOneCountOfAllTechnology(
      await queries.getOneCountOfAllTechnology(previousDate.iddate, jobboard.id)
    )
    for (const tool of tools) {
      const searchQuery = searchQueries.find(s => s.idTool === tool.idTool)
      tool.searchQuery = searchQuery?.query ?? tool.nameTool
      const previousObject = previousCounts.find(i => i.idTool === tool.idTool)
      const previousCount = previousObject?.countOfItem
      const parameters = [jobboard, tool, previousCount, dateId, emptyWords]
      if (jobboard.id === 1) await wrapper(getHeadHunter, ...parameters)
      if (jobboard.id === 2) await wrapper(getLinkedIn, ...parameters)
    }
  }
  await queries.changeStatusOfDate(dateId)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  chalk.log(`Потрачено минут: ${dateEnd} (${new Date()})`)
}

async function wrapper(
  function_,
  jobBoardRegion,
  tool,
  previousCount,
  date,
  words,
  i = 0
) {
  if (i === config.NUMBER_OF_FAILED_ATTEMPTS) {
    console.log(`Слишком много неудачных запросов`)
    sendNoticeToTelegram(
      `Слишком много неудачных запросов (${tool.nameTool}) (${function_.name})`
    )
  }
  try {
    console.log(`${tool.searchQuery}, ${function_.name}, ${new Date()}`)
    const encodedTool = encodeURIComponent(tool.searchQuery)
    const { id, nodeContainCount } = jobBoardRegion
    const url = jobBoardRegion.url.replace('<NAME_TOOL!>', encodedTool)
    const count = await function_(url, nodeContainCount, words)

    if (!isNormalCount(count, previousCount) && isProduction) {
      chalk.log('Сильно отличающиеся числа')
      sendNoticeToTelegram(
        `Сильно отличающиеся числа (${tool.nameTool}) (c: ${count} p: ${previousCount}) (${function_.name})`
      )
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
      previousCount,
      date,
      words,
      i + 1
    )
  }
}

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.iddate
}

function isNormalCount(currentCount, previousCount) {
  const maxValue = Math.max(currentCount, previousCount)
  const minValue = Math.min(currentCount, previousCount)
  const c = maxValue / 2 <= minValue
  return maxValue < config.MIN_VALUE_CHECKING_DIFFERENCES || c
}

export async function canParsing() {
  const now = new Date()
  if (now.getHours() === config.HOURS_OF_START_PARSING) {
    const [lastDate] = await queries.getLastNotTrueDate()
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
