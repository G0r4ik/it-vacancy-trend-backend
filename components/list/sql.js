import { pQuery } from '../../config/database.js'

class Queries {
  getJobBoardsRegions() {
    return pQuery(`
      SELECT jbr.id AS job_board_regions_id, jb.id AS job_board_id, c.id AS country_id, *
      FROM job_board_regions AS jbr
      JOIN job_boards AS jb ON jbr.job_board = jb.id
      JOIN countries AS c ON jbr.country = c.id;
    `)
  }

  getTools() {
    return pQuery(`
      SELECT id_tool, name_tool, search_query
      FROM tools ORDER BY id_tool;
    `)
  }

  getCategoriesTools() {
    return pQuery(`SELECT * FROM categories_tools;`)
  }

  getCategories() {
    return pQuery(`SELECT * FROM categories;`)
  }

  getEventsOfAllTools() {
    return pQuery(`
      SELECT id, id_tool, job_board_region, id_date, event_text
      FROM events;
    `)
  }

  // Count

  getOneCountOfAllTechnology(date, jbr) {
    return pQuery(
      `
      SELECT id_tool, count_of_item
      FROM count_of_items
      WHERE date_of_completion = $1 AND job_board_regions = $2
      ORDER BY id_tool;
      `,
      [date, jbr]
    )
  }

  getCountOfCurrentItem(itemId, jobBoardsRegions) {
    return pQuery(
      `
        SELECT count_of_item
        FROM count_of_items
        JOIN date_of_completion ON
        count_of_items.date_of_completion = date_of_completion.id_date
        WHERE date_of_completion.is_all_found = true
        AND count_of_items.id_tool = $1
        AND job_board_regions = $2
        ORDER BY date_of_completion.date_of_completion;
      `,
      [itemId, jobBoardsRegions]
    )
  }

  setCountsItem(idTool, lastDateId, countVacancy, jobBoardsRegions) {
    return pQuery(
      `
      INSERT INTO count_of_items
      (id_tool, date_of_completion, count_of_item, job_board_regions)
      VALUES($1,$2,$3,$4);
      `,
      [idTool, lastDateId, countVacancy, jobBoardsRegions]
    )
  }

  // Dates of tools

  changeStatusOfDate(dateId) {
    return pQuery(
      `UPDATE date_of_completion SET is_all_found = TRUE WHERE id_date = $1;`,
      [dateId]
    )
  }

  getDates() {
    return pQuery(`
      SELECT id_date, date_of_completion, events
      FROM date_of_completion
      WHERE is_all_found = TRUE
      ORDER BY id_date;
    `)
  }

  getLastDate() {
    return pQuery(
      `
      SELECT id_date as idDate
      FROM date_of_completion
      WHERE is_all_found = TRUE
      ORDER BY idDate DESC
      LIMIT 1;
       `
    )
  }

  createNewDate(date) {
    return pQuery(
      `
      INSERT INTO date_of_completion(date_of_completion)
      VALUES($1) RETURNING id_date as idDate;
      `,
      [date]
    )
  }

  //

  getEmptyWords() {
    return pQuery(`SELECT * FROM not_found_words`)
  }
}

export default new Queries()
