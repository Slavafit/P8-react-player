const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check ('password', "Пароль должен быть более 4 и менее 10 символов").isLength({min:4, max:10})
], controller.registration) //вызываем функцию из контроллера authController
router.post('/login', controller.login)
router.get('/users', controller.getUsers)

module.exports = router
