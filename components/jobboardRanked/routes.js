import Router from 'express'
import controller from './controllers.js'

const router = new Router()

router.get('/getRegions', controller.getRegions)
router.get('/getRankedJobBoardOfRegion', controller.getRankedJobBoardOfRegion)

export default router
