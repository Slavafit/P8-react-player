const User = require('./models/User')
const Role = require('./models/Role')   //импорт модели
const Song = require('./models/Song')
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
            res.json(users)
        } catch (e) {

        }
    }

    

    async postSong(req, res) {
        try {
            const { artist, track, year, fileUrl, coverUrl, category} = req.body;
            const candidate = await Song.findOne( {artist} && {track})    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: "Такой исполнитель с таким трэком уже существует"})
            }
            const song = new Song({artist, track, year, fileUrl, coverUrl, category })  //создаем пользователя
            await song.save()   //сохраняем в БД
            return res.json({message: `Исполнитель: ${artist} с трэком: ${track} успешно сохранен`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Post error'})
        }
    }


    async getSongs(req, res) {
        try {
            const songs = await Song.find()
            res.json(songs)
        } catch (e) {

        }
    }

    async getSongsById(req, res) {
        try {
            const { _id } = req.query;
            console.log("Received findById request with Id:", _id);
            const song = await Song.findById(_id);
    
            if (!song) {
                return res.status(404).json({ message: `Song with ${_id} not found` });
            }
    
            res.json(song);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    }
    

    // Обработчик для удаления песни по ID
    async deleteSongs(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            console.log("Received DELETE request with ID:", _id); // Вывод _id в консоль для отладки

        const song = await Song.findById(_id); // Используйте _id напрямую
        if (!song) {
            console.log(`Song with ${_id} not found`); // Вывод сообщения об ошибке в консоль
            return res.status(404).json({ message: `Song with ${_id} not found` });
        }

        // Если песня найдена, удаляем её
        await song.deleteOne({_id});
        
        console.log(`Song with ${_id} deleted`); // Вывод сообщения об успешном удалении в консоль
        return res.json({ message: `Song with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new authController()