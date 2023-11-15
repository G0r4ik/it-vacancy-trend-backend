import { pQuery } from '../../config/database.js'

class Queries {
  getRankedJobBoardOfRegion() {
    return pQuery(`SELECT * FROM not_found_words;`)
  }

  getJobBoardsRegions() {
    return pQuery(`
      SELECT jbr.id AS job_board_regions_id, jb.id AS job_board_id, c.id AS country_id, jbr.is_completely_parse, *
      FROM job_board_regions AS jbr
      JOIN job_boards AS jb ON jbr.job_board = jb.id
      JOIN regions AS c ON jbr.country = c.id;
    `)
  }

  getRegions() {
    return pQuery(`SELECT * FROM regions;`)
  }

  getKeywordsForRanked() {
    return pQuery(`SELECT tool FROM keywords_jobboard_ranked`)
  }

  getJobBoards(idRegion) {
    return pQuery(
      `
  SELECT jb.job_board, jbr.url, jbr.id, jbr.url
  FROM job_board_regions as jbr
  JOIN job_boards AS jb ON jbr.job_board = jb.id
  WHERE jbr.country = $1
  ORDER BY jbr.id;
`,
      [idRegion]
    )
  }

  getCounts(lastDate) {
    return pQuery(
      `
    SELECT * FROM count_of_jobboard
    WHERE date_of_check = $1`,
      [lastDate]
    )
  }

  async getLastDate() {
    const date = await pQuery(`
    SELECT * FROM count_of_jobboard
    ORDER BY date_of_check
    LIMIT 1;
    `)
    return date[0].date_of_check
  }
}

export default new Queries()
