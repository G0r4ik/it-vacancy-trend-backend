import Router from 'express'
import controller from './controllers.js'

const router = new Router()

router.get('/getCategories', controller.getCategories)
router.get('/getDates', controller.getDates)
router.get('/getTools', controller.getTools)

export default router
