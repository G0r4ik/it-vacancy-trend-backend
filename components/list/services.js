import queries from './sql.js'
import ListMapping from './mapping.js'

class Services {
  async getDates() {
    return ListMapping.dates(await queries.getDates())
  }

  async getCategories() {
    return ListMapping.categories(await queries.getCategories())
  }

  async getJobBoardsRegions() {
    const jobBoardsRegions = await queries.getJobBoardsRegions()
    return ListMapping.jobBoardsRegions(jobBoardsRegions)
  }

  async getCountOfCurrentDate(idJobBoardsRegions, dateId) {
    const dates = ListMapping.dates(await queries.getDates())
    const allTools = ListMapping.tools(await queries.getTools())

    const index = dates.map(date => date.idDate).indexOf(+dateId)
    const lastDateId = dates[index].idDate
    const lastDateId2 = dates[index - 1].idDate || dates[index].idDate

    const res = { [idJobBoardsRegions]: { counts: [], diff: [] } }
    const counts = ListMapping.getOneCountOfAllTechnology(
      await queries.getOneCountOfAllTechnology(lastDateId, idJobBoardsRegions)
    )
    const counts2 = ListMapping.getOneCountOfAllTechnology(
      await queries.getOneCountOfAllTechnology(lastDateId2, idJobBoardsRegions)
    )

    for (const tool of allTools) {
      // FIXME
      const count =
        counts.find(item => item.idTool === tool.idTool)?.countOfItem ?? null
      const count2 =
        counts2.find(item => item.idTool === tool.idTool)?.countOfItem ?? null

      res[idJobBoardsRegions].counts.push(count)
      res[idJobBoardsRegions].diff.push(count - count2)
    }

    return res
  }

  async getTools() {
    const hashCategories = await this.getHashCategories()
    const allTools = ListMapping.tools(await queries.getTools())
    const categoriesOfTools = ListMapping.categoriesOfTools(
      await queries.getCategoriesTools()
    )
    const events = ListMapping.events(await queries.getEventsOfAllTools())

    for (const tool of allTools) {
      tool.events = []
      tool.categories = []
      // FIXME
      tool.counts = {}
      tool.diff = {}
      tool.is_controversial_word = false
      tool.search_query = 'test'

      for (const event of events) {
        if (event.idTool === tool.idTool) tool.events.push(event)
      }

      const categories = categoriesOfTools
        .filter(i => i.idTool === tool.idTool)
        .sort((a, b) => a.idCategory - b.idCategory)
      for (const category of categories) {
        tool.categories.push(hashCategories[category.idCategory])
      }
    }

    return allTools
  }

  async getCountOfCurrentItem(itemId, jobBoardsRegionsID) {
    const counts = ListMapping.countOfCurrentItem(
      await queries.getCountOfCurrentItem(itemId, jobBoardsRegionsID)
    )

    const dates = await queries.getDates()
    const fixedLength = counts.length

    const myLength = dates.length - fixedLength
    const temporary = Array.from({ length: myLength }).fill(null)

    return [...temporary, ...counts.map(c => c.countOfItem)]
  }

  async getHashCategories() {
    const categories = ListMapping.categories(await queries.getCategories())
    const hashCategories = {}
    for (const category of categories) {
      hashCategories[category.idCategory] = category
    }
    return hashCategories
  }

  async getHashTools() {
    const tools = ListMapping.tools(await queries.getTools())
    const hashTools = {}
    for (const tool of tools) hashTools[tool.idTool] = tool
    return hashTools
  }

  // async getHashCounts(region, jobBoard, date) {
  //   const tools = await queries.getOneCountOfAllTechnology(date)
  //   const hashTools = {}
  //   for (const tool of tools) hashTools[tool.idTool] = tool
  //   return hashTools
  // }
}

export default new Services()
