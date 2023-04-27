import chalk from 'chalk'
import needle from 'needle'

import { getCurrentDate } from './helprers.js'
import queries from './sql.js'

function isFixedOrNotFound(findString) {
  const fixed = findString.includes('исправлен')
  const notFound = findString.includes('не найдено')
  return fixed || notFound
}

async function getString(findTool) {
  const url = `https://hh.ru/search/vacancy?no_magic=true&area=113&&items_on_page=1&text=${findTool}`
  const resp = await needle('get', url)
  const indexOfStart = resp.body.indexOf('bloko-header-3')
  const findString = resp.body.slice(indexOfStart + 45, indexOfStart + 300)

  if (!findString.includes('аканс') && !isFixedOrNotFound(findString)) {
    return getString(findTool)
  }
  return findString
}

async function getCountInPage(tool) {
  const findTool = encodeURIComponent(tool.name_tool)
  const findString = await getString(findTool)
  // console.log(chalk.dim(findString))

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

export default async function getNumberOfVacancies() {
  console.log(chalk.bgYellow('Start getNumberOfVacancies'))
  const dateStart = new Date()
  const idDate = await createAndGetDateOfNewSearch()
  const tools = await queries.getTools()
  for (const tool of tools) await setAndLogItems(tool, idDate)
  await queries.changeStatusOfDate(idDate)
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  console.log(chalk.bgYellow(`Потрачено минут: ${dateEnd}`))
}
