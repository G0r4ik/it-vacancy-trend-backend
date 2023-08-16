import queries from './sql.js'

class Services {
  getDates() {
    return queries.getDates()
  }

  async getCategories() {
    return queries.getCategories()
  }

  async getOnlyTools() {
    return queries.getTools()
  }

  async getTools(jobBoardRegion, dateId) {
    const hashCategories = await this.getHashCategories()
    const [lastDate, lastDate2] = await queries.getTwoLastDates()
    const lastDateId = lastDate.id_date
    const lastDateId2 = lastDate2.id_date
    // const lastDateId = dateId || lastDate.id_date

    const counts = await queries.getOneCountOfAllTechnology(lastDateId)
    const counts2 = await queries.getOneCountOfAllTechnology(lastDateId2)

    const allTools = await queries.getTools()
    const categoriesOfTools = await queries.getCategoriesTools()

    // NOTE работает медленее на 50мс
    // const hashTools = await this.getHashCounts(region, jobBoard, lastDateId)

    const events = await queries.getEventsOfAllTools(jobBoardRegion)
    console.log(events)

    for (const tool of allTools) {
      // tool.region = region
      // tool.jobBoard = jobBoard
      tool.events = []
      for (const event of events) {
        if (event.id_tool === tool.id_tool) tool.events.push(event)
      }

      const categories = categoriesOfTools
        .filter(i => i.id_tool === tool.id_tool)
        .sort((a, b) => a.id_category - b.id_category)
      for (const category of categories) {
        if (!tool.categories) tool.categories = []
        tool.categories.push(hashCategories[category.id_category])
      }
      const count =
        counts.find(item => item.id_tool === tool.id_tool)?.count_of_item ||
        null
      // tool.counts = { [jobBoard]: { [lastDateId]: count } }
      const count2 =
        counts2.find(item => item.id_tool === tool.id_tool)?.count_of_item ||
        null
      tool.counts = {
        ['HeadHunter']: { [lastDateId]: count, [lastDateId2]: count2 },
      }
    }

    return allTools.sort(
      (a, b) =>
        b.counts['HeadHunter'][lastDateId] - a.counts['HeadHunter'][lastDateId]
    )
  }

  async getHashCategories() {
    const categories = await queries.getCategories()
    const hashCategories = {}
    for (const category of categories) {
      hashCategories[category.id_category] = category
    }
    return hashCategories
  }

  // Вроде бы невыгодно использовать
  async getHashTools() {
    const tools = await queries.getTools()
    const hashTools = {}
    for (const tool of tools) hashTools[tool.id_tool] = tool
    return hashTools
  }

  async getHashCounts(region, jobBoard, date) {
    const tools = await queries.getOneCountOfAllTechnology(date)
    const hashTools = {}
    for (const tool of tools) hashTools[tool.id_tool] = tool
    return hashTools
  }

  async getCountOfCurrentItem(itemId, region, jobBoard) {
    const counts = await queries.getCountOfCurrentItem(itemId)
    const dates = await queries.getDates()
    const fixedLength = counts.length

    for (let i = 0; i < dates.length - fixedLength; i++) {
      counts.unshift({
        date_of_completion: dates[i].id_date,
        count_of_item: null,
      })
    }
    return counts
  }

  // async getEventsOfCurrentItem(itemId, region, jobBoard) {
  //   const jobBoardRegion = await queries.getCombinationOfRegionsAndJobBoard(
  //     jobBoard,
  //     region
  //   )
  //   const events = await queries.getEventsOfOneTool(itemId, jobBoardRegion.id)
  //   return events
  // }
}

export default new Services()
