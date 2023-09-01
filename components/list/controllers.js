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

  async getCountOfCurrentDate(req, res, next) {
    try {
      const { idJobBoardsRegions, idDate } = req.query
      checkParameters('getCountOfCurrentDate', { idJobBoardsRegions, idDate })
      const tools = await services.getCountOfCurrentDate(
        idJobBoardsRegions,
        idDate
      )
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getTools(req, res, next) {
    try {
      const tools = await services.getTools()
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getCountOfCurrentItem(req, res, next) {
    try {
      const { idTool, idJobBoardsRegions } = req.query
      checkParameters('getCountOfCurrentItem', { idTool, idJobBoardsRegions })
      const options = [idTool, idJobBoardsRegions]
      const counts = await services.getCountOfCurrentItem(...options)
      res.json(counts)
    } catch (error) {
      next(error)
    }
  }

  async getJobBoardsRegions(req, res, next) {
    try {
      const jobBoardsRegions = await services.getJobBoardsRegions()
      res.json(jobBoardsRegions)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controllers()
