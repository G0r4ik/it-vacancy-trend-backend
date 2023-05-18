import { pQuery } from '../../config/database.js'

class Queries {
  getTools() {
    return pQuery('SELECT * FROM tools')
  }

  getCategories() {
    return pQuery('SELECT * FROM categories')
  }

  // Count

  getNumberOfAllTechnology(region, jobBoard, date) {
    return pQuery(
      `SELECT * FROM count_of_items WHERE region = $1 AND job_board = $2 AND date_of_completion = $3`,
      [region, jobBoard, date]
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
      'SELECT date_of_completion,count_of_item FROM count_of_items WHERE id_tool = $1 ORDER BY date_of_completion',
      [itemId]
    )
  }

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

  getLastTrueDate() {
    return pQuery(
      'SELECT id_date FROM date_of_completion WHERE is_all_found = TRUE ORDER BY id_date DESC LIMIT 1'
    )
  }

  getLastDate() {
    return pQuery(
      'SELECT * FROM date_of_completion ORDER BY id_date DESC LIMIT 1'
    )
  }

  createNewDate(date) {
    return pQuery(
      'INSERT INTO date_of_completion(date_of_completion) VALUES($1)',
      [date]
    )
  }
}

export default new Queries()
