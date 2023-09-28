const jwt = require('jsonwebtoken');
const {secret} = require('../config')
module.exports = function (roles) {             //передаем массив ролей
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
                if (!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }
            const {roles: userRoles} = jwt.verify(token, secret)    //меняем имя на userRoles
            let hasRole = false     //по умолчанию
            userRoles.forEach(role => {     //проверка, есть ли в списке ролей те роли, которые разрешены для этой функции
                if (roles.includes(role))   //если массив roles содержит в себе роль, которая есть у пользователя
                hasRole = true      //то меняем на тру
            });
            if (!hasRole) {         //если роль не разрешена возврат клиенту
                return res.status(403).json({message: "У вас нет доступа"})
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}