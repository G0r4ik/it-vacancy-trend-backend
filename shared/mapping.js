// FIXME
class ListMapping {
  dates = dates =>
    dates.map(date => ({
      idDate: Number(date.id_date),
      dateOfCompletion: date.date_of_completion,
      events: date.events,
    }))

  categories = categories =>
    categories.map(category => ({
      idCategory: Number(category.id_category),
      nameCategory: category.name_category,
    }))

  events = events =>
    events.map(event_ => ({
      idEvent: Number(event_.id),
      idTool: Number(event_.id_tool),
      idJoBoardRegion: Number(event_.job_board_region),
      idDate: Number(event_.id_date),
      eventText: event_.event_text,
    }))

  jobBoardsRegions = jobBoardsRegions =>
    jobBoardsRegions.map(jobBoardRegion => ({
      id: Number(jobBoardRegion.id),
      idRegion: Number(jobBoardRegion.country_id),
      idJobBoardRegions: Number(jobBoardRegion.job_board_regions_id),
      idJobBoard: Number(jobBoardRegion.job_board_id),
      jobBoard: jobBoardRegion.job_board,
      region: jobBoardRegion.country,
      url: jobBoardRegion.url,
      nodeContainCount: jobBoardRegion.node_contain_count,
      isCompletelyParse: jobBoardRegion.is_completely_parse,
    }))

  tools = tools =>
    tools.map(tool => ({
      idTool: tool.id_tool,
      nameTool: tool.name_tool,
    }))

  categoriesOfTools = categoriesOfTools =>
    categoriesOfTools.map(category => ({
      idTool: category.id_tool,
      idCategory: category.id_category,
    }))

  countOfCurrentItem = countOfCurrentItem =>
    countOfCurrentItem.map(category => ({
      countOfItem: category.count_of_item,
    }))

  getOneCountOfAllTechnology = getOneCountOfAllTechnology =>
    getOneCountOfAllTechnology.map(category => ({
      idTool: category.id_tool,
      countOfItem: category.count_of_item,
    }))

  searchQueries = searchQueries =>
    searchQueries.map(query => ({
      id: Number(query.id),
      idTool: query.id_tool,
      idJobBoardRegions: query.id_job_board_regions,
      query: query.query,
    }))
}

export default new ListMapping()

// FIX ME
// dateOfCompletion idDate id_date
