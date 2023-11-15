import services from './services.js'
import { checkParameters } from '../../shared/helpers.js'

class Controllers {
  async getRankedJobBoardOfRegion(req, res, next) {
    try {
      const { idRegion } = req.query
      checkParameters('getRankedJobBoardOfRegion', { idRegion })
      const tools = await services.getRankedJobBoardOfRegion(idRegion)
      res.json(tools)
    } catch (error) {
      next(error)
    }
  }

  async getRegions(req, res, next) {
    try {
      const regions = await services.getRegions()
      res.json(regions)
    } catch (error) {
      next(error)
    }
  }
}

export default new Controllers()
