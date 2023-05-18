import queries from './sql.js'

class Services {
  async getHashCategories() {
    const categories = await queries.getCategories()
    const hashCategories = {}
    for (const category of categories) {
      hashCategories[category.id_category] = category
    }
    return hashCategories
  }

  async getHashTools() {
    const tools = await queries.getTools()
    const hashTools = {}
    for (const tool of tools) hashTools[tool.id_tool] = tool
    return hashTools
  }

  getCountOfCurrentItem(itemId) {
    return queries.getCountOfCurrentItem(itemId)
  }

  // eslint-disable-next-line max-statements
  async getTools(region, jobBoard, dateId) {
    const hashCategories = await this.getHashCategories()
    const hashTools = await this.getHashTools()

    const lastDate = await queries.getLastTrueDate()
    const lastDateId = dateId || lastDate[0].id_date

    const tools = await queries.getNumberOfAllTechnology(
      region,
      jobBoard,
      lastDateId
    )

    const result = []
    for (const tool of tools) {
      const item = { ...hashTools[tool.id_tool], ...tool }
      item.counts = { [jobBoard]: {} }
      item.counts[jobBoard][item.date_of_completion] = item.count_of_item
      item.category = hashCategories[item.id_category]
      delete item.id_category
      delete item.count_of_item
      result.push(item)
    }

    return result.sort((a, b) => b.count_of_item - a.count_of_item)
  }

  getDates() {
    return queries.getDates()
  }

  getCategories() {
    return queries.getCategories()
  }
}

export default new Services()
