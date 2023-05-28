import services from './services.js'

class Controllers {
  async getCategories(req, res) {
    const categories = await services.getCategories()
    res.json(categories)
  }

  async getDates(req, res) {
    const dates = await services.getDates()
    res.json(dates)
  }

  async getTools(req, res) {
    const { region, jobBoard, dateId } = req.query
    const tools = await services.getTools(region, jobBoard, dateId)
    res.json(tools)
  }

  async getCountOfCurrentItem(req, res) {
    const { idTool, region, jobBoard } = req.query
    const counts = await services.getCountOfCurrentItem(
      idTool,
      region,
      jobBoard
    )
    res.json(counts)
  }

  async getAAA(req, res) {
    const { idTool, idCategory } = req.query
    console.log(idTool, idCategory)
    // await services.aaaa2(idTool, idCategory)
    // res.end(1)
  }
}

export default new Controllers()
