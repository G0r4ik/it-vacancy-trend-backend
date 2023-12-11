import Router from 'express'
import controller from './controller.js'

const router = new Router()

router.get('/refresh_token', controller.refreshToken)

export default router
