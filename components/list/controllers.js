import services from './services.js'
import { checkParameters } from '../../shared/helpers.js'

class Controllers {
  async getCategories(req, res, next) {
    try {
      const categories = await services.getCategories()
      res.json(categories)
    } catch (error) {
      next(error)
    }
  }

  async getDates(req, res, next) {
    try {
      const dates = await services.getDates()
      res.json(dates)
    } catch (error) {
      next(error)
    }
  }

  async getOnlyTools(req, res, next) {
    try {
      const tools = await services.getOnlyTools()
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getTools(req, res, next) {
    try {
      const { region, jobBoard, dateId } = req.query
      checkParameters('getTools', { region, jobBoard, dateId })
      const tools = await services.getTools(region, jobBoard, dateId)
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getCountOfCurrentItem(req, res, next) {
    try {
      const { idTool, region, jobBoard } = req.query
      const options = [idTool, region, jobBoard]
      checkParameters('getCountOfCurrentItem', { idTool, region, jobBoard })
      const counts = await services.getCountOfCurrentItem(...options)
      res.json(counts)
    } catch (error) {
      next(error)
    }
  }

  async getEventsOfCurrentItem(req, res, next) {
    try {
      const { idTool, region, jobBoard } = req.query
      const options = [idTool, region, jobBoard]
      checkParameters('getCountOfCurrentItem', { idTool, region, jobBoard })
      const events = await services.getEventsOfCurrentItem(...options)
      res.json(events)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controllers()
