import Router from 'express'
import controller from './controllers.js'

const router = new Router()

router.get('/getCountOfCurrentItem', controller.getCountOfCurrentItem)
router.get('/getCategories', controller.getCategories)
router.get('/getDates', controller.getDates)
router.get('/getTools', controller.getTools)
router.get('/aaaa2', controller.getAAA)

export default router
