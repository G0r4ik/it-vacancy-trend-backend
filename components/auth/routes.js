import Router from 'express'
import { body } from 'express-validator'
import controller from './controller.js'
import { validateRequest } from '../../shared/middleware.js'

const router = new Router()
router.post(
  '/registration',
  body('email').isEmail().withMessage('Not a valid e-mail address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Пароль должен содержать минимум 8 символов'),
  validateRequest,
  controller.registrationUser
)
router.get('/activate_account', controller.activateAccount)
router.post(
  '/login',
  body('email').isEmail().withMessage('Not a valid e-mail address'),
  // body('password')
  // .isLength({ min: 8 })
  // .withMessage('Пароль должен содержать минимум 8 символов'),
  validateRequest,
  controller.loginUser
)
router.post('/logout', controller.logout)

export default router
