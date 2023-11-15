/* eslint-disable no-await-in-loop */
import * as dotenv from 'dotenv'
// count_of_jobboard - заполнять данными о том сколько вакансий встречается
//

import queries from './sql.js'
import chalk from '../../shared/chalkColors.js'
import { getCurrentDate } from '../../shared/helpers.js'
import ListMapping from '../../shared/mapping.js'

dotenv.config()

export async function parsingJobBoards() {
  chalk.log(`Start parsing of jobboards ${new Date()}`)
  const dateStart = new Date()
  //

  const [previousDate] = await queries.getLastDate()
  const dateId = await createAndGetDateOfNewParsing()
  const tools = ListMapping.tools(await queries.getKeywordsForRanked())

  //
  const jobboards = ListMapping.jobBoardsRegions(
    await queries.getJobBoardsRegions()
  )

  for (const jobboard of jobboards) {
    // const emptyWordsNotMapped = await queries.getEmptyWords(jobboard.id)
    // const emptyWords = emptyWordsNotMapped.map(w => w.word)
    // const searchQueries = ListMapping.searchQueries(
    //   await queries.getSearchQueries(jobboard.id)
    // )
    // const previousCounts = ListMapping.getOneCountOfAllTechnology(
    //   await queries.getOneCountOfAllTechnology(previousDate.iddate, jobboard.id)
    // )
  }

  //
  const dateEnd = ((Date.now() - dateStart) / 60_000).toFixed(2)
  chalk.log(`Потрачено минут: ${dateEnd} (${new Date()})`)
}

async function createAndGetDateOfNewParsing() {
  const [lastDate] = await queries.createNewDate(getCurrentDate())
  return lastDate.iddate
}
