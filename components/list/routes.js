import Router from 'express'
import controller from './controllers.js'
// import { authMiddleware } from '../auth/index.js'

const router = new Router()

router.get('/getDates', controller.getDates)
router.get('/getTools', controller.getTools)
router.get('/getCategories', controller.getCategories)
router.get('/getJobBoardsRegions', controller.getJobBoardsRegions)
router.get('/getCountOfCurrentItem', controller.getCountOfCurrentItem)
router.get('/getOneCountForAllTools', controller.getOneCountForAllTools)

export default router
