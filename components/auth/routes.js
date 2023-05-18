import Router from 'express'
import controller from './controller.js'

const router = new Router()

router.post('/registrationUser', controller.registrationUser)
router.get('/activateAccount', controller.activateAccount)
router.post('/refreshToken', controller.refreshToken)
router.post('/loginUser', controller.loginUser)
router.post('/logout', controller.logout)

export default router
