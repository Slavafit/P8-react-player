const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
} 

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty() ) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password } = req.body;
            const candidate = await User.findOne({username})    //ищем пользователя в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            const userRole = await Role.findOne({value: "USER"})    //ищем роль
            const user = new User({username, password: hashPassword, roles: [userRole.value]})  //создаем пользователя
            await user.save()   //сохраняем в БД
            return res.json({message: "Пользователь успешно зарегистрирован"})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            //res.json(users)
            res.json("server work")
        } catch (e) {

        }
    }
}

module.exports = new authController()
