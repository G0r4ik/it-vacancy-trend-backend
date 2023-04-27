import * as dotenv from 'dotenv'
import services from './services.js'

dotenv.config()

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
    const { region, jobBoard } = req.query
    const tools = await services.getTools(region, jobBoard)
    res.json(tools)
  }
}

export default new Controllers()
