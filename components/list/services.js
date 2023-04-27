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
    for (const tool of tools) {
      hashTools[tool.id_tool] = tool
    }
    return hashTools
  }

  // eslint-disable-next-line max-statements
  async getTools(region, jobBoard) {
    const hashCategories = await this.getHashCategories()
    const hashTools = await this.getHashTools()
    const lastDate = await queries.getLastTrueDate()
    const tools2 = await queries.getNumberOfAllTechnology(
      region,
      jobBoard,
      lastDate[0].id_date
    )

    for (const tool2 of tools2) {
      hashTools[tool2.id_tool] = { ...hashTools[tool2.id_tool], ...tool2 }
      const hashItem = hashTools[tool2.id_tool]
      if (!hashItem.counts) hashItem.counts = { [jobBoard]: {} }
      const dateOfCompleation = hashItem.date_of_completion
      hashItem.counts[jobBoard][dateOfCompleation] = hashItem.count_of_item
      hashItem.category = hashCategories[hashItem.id_category]
      delete hashItem.id_category
    }

    const countOfTool = Object.values(hashTools)
    return countOfTool.sort((a, b) => b.count_of_item - a.count_of_item)
  }

  getDates() {
    return queries.getDates()
  }

  getCategories() {
    return queries.getCategories()
  }
}

export default new Services()
