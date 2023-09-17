import services from './services.js'
import { checkParameters } from '../../shared/helpers.js'

class Controllers {
  async getDates(req, res, next) {
    try {
      const dates = await services.getDates()
      res.json(dates)
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

  async getCategories(req, res, next) {
    try {
      const categories = await services.getCategories()
      res.json(categories)
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

  async getOneCountForAllTools(req, res, next) {
    try {
      const { idJobBoardRegion, idDate } = req.query
      checkParameters('getOneCountForAllTools', { idJobBoardRegion, idDate })
      const options = [idJobBoardRegion, idDate]
      const tools = await services.getOneCountForAllTools(...options)
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getCountOfCurrentItem(req, res, next) {
    try {
      const { idTool, idJobBoardRegion } = req.query
      checkParameters('getCountOfCurrentItem', { idTool, idJobBoardRegion })
      const options = [idTool, idJobBoardRegion]
      const counts = await services.getCountOfCurrentItem(...options)
      res.json(counts)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controllers()
