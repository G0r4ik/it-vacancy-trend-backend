import queries from './sql.js'

class Services {
  getDates() {
    return queries.getDates()
  }

  async getCategories() {
    return queries.getCategories()
  }

  async getTools(region, jobBoard) {
    const hashCategories = await this.getHashCategories()
    const [lastDate] = await queries.getLastDate()
    const lastDateId = lastDate.id_date

    const options = [region, jobBoard, lastDateId]
    const counts = await queries.getOneCountOfAllTechnology(...options)

    const allTools = await queries.getTools()
    const categoriesOfTools = await queries.getCategoriesTools()
    // NOTE работает медленее на 50мс
    // const hashTools = await this.getHashCounts(region, jobBoard, lastDateId)

    for (const tool of allTools) {
      tool.region = region
      tool.jobBoard = jobBoard

      const categories = categoriesOfTools.filter(
        i => i.id_tool === tool.id_tool
      )
      for (const category of categories) {
        if (!tool.categories) tool.categories = []
        tool.categories.push(hashCategories[category.id_category])
      }

      const count = counts.find(
        item => item.id_tool === tool.id_tool
      ).count_of_item
      tool.counts = { [jobBoard]: { [lastDateId]: count } }
    }

    return allTools.sort(
      (a, b) => b.counts[jobBoard][lastDateId] - a.counts[jobBoard][lastDateId]
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
    const tools = await queries.getOneCountOfAllTechnology(
      region,
      jobBoard,
      date
    )
    const hashTools = {}
    for (const tool of tools) hashTools[tool.id_tool] = tool
    return hashTools
  }

  getCountOfCurrentItem(itemId) {
    return queries.getCountOfCurrentItem(itemId)
  }
}

export default new Services()
