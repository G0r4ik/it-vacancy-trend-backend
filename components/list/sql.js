import { pQuery } from '../../config/database.js'

class Queries {
  getJobBoardsAndCounrties() {
    return pQuery(`
    SELECT jbr.id AS job_board_regions_id, jb.id AS job_board_id, c.id AS country_id, *
    FROM job_board_regions AS jbr
    JOIN job_boards AS jb ON jbr.job_board = jb.id
    JOIN countries AS c ON jbr.country = c.id;`)
  }

  getTools() {
    return pQuery('SELECT * FROM tools')
  }

  getCategoriesTools() {
    return pQuery('SELECT * FROM categories_tools')
  }

  getCategories() {
    return pQuery('SELECT * FROM categories')
  }

  // Count

  getOneCountOfAllTechnology(date) {
    return pQuery(
      `SELECT * FROM count_of_items WHERE date_of_completion = $1`,
      [date]
    )
  }

  getNumberOfOneTechnology(region, jobBoard) {
    return pQuery(
      `SELECT * FROM count_of_items WHERE region = $1 AND job_board = $2`,
      [region, jobBoard]
    )
  }

  getCountOfCurrentItem(itemId) {
    return pQuery(
      `
        SELECT count_of_items.date_of_completion, count_of_items.count_of_item
        FROM count_of_items
        JOIN date_of_completion ON count_of_items.date_of_completion = date_of_completion.id_date
        WHERE date_of_completion.is_all_found = true AND count_of_items.id_tool = $1
        ORDER BY count_of_items.date_of_completion;
      `,
      [itemId]
    )
  }

  // FIX хардкод HH
  setCountsItem(id_tool, lastDateId, countVacancy, jobBoardRegions) {
    return pQuery(
      `INSERT INTO count_of_items(id_tool,date_of_completion,count_of_item, job_board_regions) VALUES($1,$2,$3,$4)`,
      [id_tool, lastDateId, countVacancy, jobBoardRegions]
    )
  }

  // Dates of tools

  changeStatusOfDate(dateId) {
    return pQuery(
      'UPDATE date_of_completion SET is_all_found = TRUE WHERE id_date = $1',
      [dateId]
    )
  }

  getDates() {
    return pQuery(
      `SELECT * FROM date_of_completion WHERE is_all_found = TRUE ORDER BY id_date`
    )
  }

  getLastDate() {
    return pQuery(
      'SELECT * FROM date_of_completion WHERE is_all_found = TRUE ORDER BY id_date DESC LIMIT 1'
    )
  }

  getTwoLastDates() {
    return pQuery(
      'SELECT * FROM date_of_completion WHERE is_all_found = TRUE ORDER BY id_date DESC LIMIT 2'
    )
  }

  createNewDate(date) {
    return pQuery(
      'INSERT INTO date_of_completion(date_of_completion) VALUES($1) RETURNING id_date',
      [date]
    )
  }

  //

  async getCombinationOfRegionsAndJobBoard(job_board_id, regions_id) {
    const response = await pQuery(
      'SELECT * FROM job_board_regions WHERE job_board = $1 AND country = $2',
      [job_board_id, regions_id]
    )
    return response[0]
  }

  getEventsOfOneTool(id_tool, job_board_id) {
    return pQuery(
      'SELECT * FROM events WHERE id_tool = $1 AND id_regions = $2',
      [id_tool, job_board_id]
    )
  }
}

export default new Queries()
