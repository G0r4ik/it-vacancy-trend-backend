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
    const b = await queries.aaa()
    const res = {}
    for (const item of b) {
      item.name = hashTools[item.id_tool].name_tool
      if (res[item.id_tool]) {
        res[item.id_tool].names.push({
          id_category: item.id_category,
          name_category: hashCategories[item.id_category].name_category,
        })
      } else {
        item.names = []
        item.names.push({
          id_category: item.id_category,
          name_category: hashCategories[item.id_category].name_category,
        })
        res[item.id_tool] = { ...item }
      }
    }

    const result = []
    for (const tool of tools) {
      const item = { ...hashTools[tool.id_tool], ...tool }
      item.counts = { [jobBoard]: {} }
      item.counts[jobBoard][item.date_of_completion] = item.count_of_item
      item.category = hashCategories[item.id_category]
      item.categories = res[item.id_tool]?.names
      delete item.id_category
      delete item.count_of_item
      result.push(item)
    }

    return result.sort(
      (a, b) =>
        b.counts[jobBoard][b.date_of_completion] -
        a.counts[jobBoard][a.date_of_completion]
    )
  }

  getDates() {
    return queries.getDates()
  }

  getCategories() {
    return queries.getCategories()
  }

  // eslint-disable-next-line max-statements
  async aaaa2(tech, category) {
    // const cat = await this.getHashCategories()
    // const too = await this.getHashTools()
    // const b = await queries.aaa()
    // const res = {}
    // for (const item of b) {
    //   // if (!item.names) item.names = []
    //   // item.names.push(cat[item.id_category].name_category)
    //   item.name = too[item.id_tool].name_tool
    //   if (res[item.id_tool]) {
    //     res[item.id_tool].names.push(cat[item.id_category].name_category)
    //   } else {
    //     item.names = []
    //     item.names.push(cat[item.id_category].name_category)
    //     res[item.id_tool] = { ...item }
    //   }
    // }
    // return res
    await queries.aaa2(tech, category)
  }
}

export default new Services()
