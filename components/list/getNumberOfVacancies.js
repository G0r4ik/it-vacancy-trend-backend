import chalk from 'chalk'

import { getCurrentDate } from './helprers.js'
import queries from './sql.js'
import { HOURS_OF_START_PARSING } from '../../shared/consts.js'

function isSameDay(date, now) {
  const isDay = date.getDay() === now.getDay()
  const isMonth = date.getMonth() === now.getMonth()
  const isYear = date.getFullYear() === now.getFullYear()
  return isDay && isMonth && isYear
}

export async function canParsing() {
  const now = new Date()
  if (now.getHours() === HOURS_OF_START_PARSING) {
    const [lastDate] = await queries.getLastDate()
    return !isSameDay(new Date(lastDate.date_of_completion), now)
  }
  return false
}

function isFixedOrNotFound(findString) {
  const fixed = findString.includes('исправлен')
  const notFound = findString.includes('не найдено')
  return fixed || notFound
}

async function getString(findTool) {
  const a = await fetch(
    `https://spb.hh.ru/search/vacancy?no_magic=true&area=113&items_on_page=1&text=${findTool}`
  )
  const resp = await a.text()

  const indexOfStart = resp.indexOf('bloko-header-3')
  const findString = resp.slice(indexOfStart + 45, indexOfStart + 300)

  if (!findString.includes('аканс') && !isFixedOrNotFound(findString)) {
    return getString(findTool)
  }
  return findString
}

async function getCountInPage(tool) {
  const findTool = encodeURIComponent(tool.name_tool)
  const findString = await getString(findTool)

  if (isFixedOrNotFound(findString)) return 0

  let countVacancy = ''
  const nFIXME = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])
  for (const element of findString) {
    if (nFIXME.has(element)) countVacancy += element
    if (element === 'в') break
  }
  return Number(countVacancy)
}

async function createAndGetDateOfNewSearch() {
  await queries.createNewDate(getCurrentDate())
  const lastDateId = await queries.getLastDate()
  return lastDateId[0].id_date
}

async function setAndLogItems(tool, idDate) {
  const countVacancy = await getCountInPage(tool)
  console.log(chalk.magenta(tool.name_tool, countVacancy))
  await queries.setCountsItem(tool.id_tool, idDate, countVacancy)
}

export async function getNumberOfVacancies() {
  console.log(chalk.bgYellow('Start getNumberOfVacancies'))
  const dateStart = new Date()
  const idDate = await createAndGetDateOfNewSearch()
  const tools = await queries.getTools()
  for (const tool of tools) await setAndLogItems(tool, idDate)
  await queries.changeStatusOfDate(idDate)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  console.log(chalk.bgYellow(`Потрачено минут: ${dateEnd}`))
}
