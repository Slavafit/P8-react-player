const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

router.post('/registration', [
     check('username', "username cannot be empty").notEmpty(),
     check('email', "email cannot be empty").notEmpty(),
     check('email', "not is an email address").isEmail(),
     check ('password', "The password must be more than 4 and less than 10 characters")
     .isLength({min:4, max:10}, )
     ], controller.registration) //вызываем функцию из контроллера authController
router.post('/login', controller.login)
router.post('/songs',  [
     check('artist', "cannot be empty").notEmpty(),
], roleMiddleware(['ADMIN']), controller.postSong)

router.post('/playlist', authMiddleware, controller.postPlaylist)
router.post('/songtolist', controller.postSongToList)

router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/dashboard', roleMiddleware(['ADMIN']), controller.getUsers)
router.get('/personal', roleMiddleware(['USER']), controller.getUserByUsername)
router.get('/songs', controller.getSongs)
// router.get('/playlist', authMiddleware, controller.getPlaylistById)
router.get('/playlist', authMiddleware, controller.getPlaylist)

router.put('/songs', roleMiddleware(['ADMIN']), controller.updateSongs)
router.put('/users', roleMiddleware(['ADMIN','USER']), controller.updateUser)
router.put('/playlist', authMiddleware, controller.updatePlaylist)

router.delete('/users', roleMiddleware(['ADMIN','USER']), controller.deleteUser)
router.delete('/songs', roleMiddleware(['ADMIN']), controller.deleteSongs)
router.delete('/playlist', authMiddleware, controller.deletePlaylist)




module.exports = router
