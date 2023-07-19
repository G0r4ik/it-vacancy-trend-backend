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
  setCountsItem(id_tool, lastDateId, countVacancy) {
    return pQuery(
      `INSERT INTO count_of_items(region,job_board,id_tool,date_of_completion,count_of_item) VALUES('Russia','HeadHunter',$1,$2,$3)`,
      [id_tool, lastDateId, countVacancy]
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

  createNewDate(date) {
    return pQuery(
      'INSERT INTO date_of_completion(date_of_completion) VALUES($1) RETURNING id_date',
      [date]
    )
  }
}

export default new Queries()
