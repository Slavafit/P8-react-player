const User = require('./models/User')
const Role = require('./models/Role')   //импорт модели
const Song = require('./models/Song')
const Playlist = require('./models/Playlist')
const mailer = require('./mailer');     //импорт настроек
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Если есть ошибки валидации
                const errorMessages = errors.array().map(error => ({
            
                  message: error.msg,
                }));
                return res.status(400).json({errors: errorMessages });
            }
            const {username, email, password } = req.body;
            const candidate = await User.findOne({ $or: [{ username }, { email }] });    //ищем пользователя в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: `User with ${username} or ${email} already exists`});
            }
            const hashPassword = bcrypt.hashSync(password, 7);  //захешировали пароль
            const userRole = await Role.findOne({value: "USER"})    //ищем роль
            const user = new User({username, email, password: hashPassword, roles: [userRole.value]})  //создаем пользователя
            await user.save()   //сохраняем в БД
            
            const mailMessage = {
                from: 'Cloud Music, slavafit@mail.ru',
                to: `${email}`,
                subject: `Successfully registred on our site`,
                html: `
                <h2>Congratulations, ${username}! You are successfully registred on our site!</h2>
                
                <i>your account information:</i>
                <ul>
                    <li>username: ${username}</li>
                    <li>email: ${email}</li>
                    <li>password: ${password}</li>
                </ul>
                
                <p>This letter does not require a reply.<p>`
            }
            mailer(mailMessage);
            return res.json({message: `User ${username} has been successfully registered`})  //вернули сообщение клиенту

        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', error: e.message })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body   //получили данные от клиента
            //ищем пользователя в базе
            const user = await User.findOne({email})
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `User with ${email} not found`})
            }
            //расшифровываю пароль клиента при помощи compareSync
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(401).json({message: `Incorrect password entered`})
            }
            //генерирую токен и отправляю клиенту
            const token = generateAccessToken(user._id, user.roles)
            const userData = {userId: user._id, username: user.username, role: user.roles[0]}
            return res.json({token, userData})
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

    async getUserByUsername(req, res) {
        try {
            const { username } = req.query;
            // console.log("Received getUserByUsername request with:", username);
            //ищем пользователя в базе
            const user = await User.findOne({username});    
       
            //если не найден, то объект будет пустой и пойдет по условию ниже
            if (!user) {
                return res.status(404).json({message: `User with ${username} not found`})
            }
            //const users = await User.find()
            return res.json({user})
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обработчик для изменения пользователя по Id
    // async updateUser(req, res) {
    //     try {
    //         const { _id } = req.query;
    //         const updatedUser = req.body; // обновленные данные из тела запроса
    //         // console.log(_id)
    //         // console.log(updatedUser)
    //         //Заменяем найденное новым объектом
    //         const user = await User.findByIdAndUpdate(_id, updatedUser, { new: true });
    //         if (!user) {
    //             return res.status(404).json({ message: `User not updated` });
    //         }
    //         res.json(user); // обновленные данные в ответе

    //     } catch (e) {
    //         console.log(e)
    //         res.status(500).json({ message: 'Server error' });
    //     }
    // }
    async updateUser(req, res) {
        try {
            const { _id } = req.query;
            const updatedUser = req.body; // обновленные данные из тела запроса
            // console.log(_id)
            // console.log(updatedUser)
            //Заменяем найденное новым объектом
            const user = await User.findByIdAndUpdate(_id, updatedUser, { new: true });
            if (!user) {
                return res.status(404).json({ message: `User not updated` });
            }
            // Теперь, обновляем имя пользователя во всех связанных плейлистах
            const playlists = await Playlist.updateMany({ userName: _id }, { userName: updatedUser.userName });
            console.log(playlists)
            res.json(user); // обновленные данные в ответе

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обработчик для удаления User по Id
    async deleteUser(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            // console.log("Received deleteUser request with Id:", _id);
            const user = await User.findById(_id); // Используйте _id напрямую
            if (!user) {
                return res.status(404).json({ message: `User with ${_id} not found` });
            }
            // Если user найден, удаляем
            // console.log("User Id: ", _id, " deleted");
            await user.deleteOne({_id});
        
            return res.json({ message: `User with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    async postSong(req, res) {
        try {
            const { artist, track, year, fileUrl, coverUrl, category} = req.body;
            const candidate = await Song.findOne({ $or: [{ artist }, { track }] })    //ищем данные в БД
            if (candidate) {        //если нашли вернули сообщение
                return res.status(400).json({message: "Such an artist with such a track already exists"})
            }
            const song = new Song({artist, track, year, fileUrl, coverUrl, category })  //создаем пользователя
            await song.save()   //сохраняем в БД
            return res.json({message: `artist: ${artist} with track: ${track} successfully saved`})  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Post error'})
        }
    }

    async getSongs(req, res) {
        try {
            const songs = await Song.find()
            res.json(songs)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'getSongs error'})
        }
    }
    async getSong(req, res) {
        try {
            const { search } = req.query;
            if (!search) {
                return res.status(400).json({ message: 'Search query is required' });
            }
            // console.log("Received Search request with: ",search);
            const songs = await Song.find({
                $or: [
                    { artist: { $regex: search, $options: 'i' } }, // Поиск по полю artist, игнорируя регистр
                    { track: { $regex: search, $options: 'i' } }  // Поиск по полю title, игнорируя регистр
                ]
            });
            //ответ на клиент если не найдено
            if (songs.length === 0) {
                return res.status(404).json({ message: 'No results found' });
            }
            res.json(songs)
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Search error'})
        }
    }

    async getSongsById(req, res) {
        try {
            const { _id } = req.query;
            // console.log("Received findById request with Id:", _id);
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
    
    // Обработчик для изменения песни по Id
    async updateSongs(req, res) {
        try {
            const { _id } = req.query;
            const updatedSong = req.body; // обновленные данные песни из тела запроса
            //Заменяем найденую песню новым объектом
            const song = await Song.findByIdAndUpdate(_id, updatedSong, { new: true });

            if (!song) {
                return res.status(400).json({ message: `Song with ${_id} not updated` });
            }

            res.json(song); // Отправьте обновленные данные песни в ответе

        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Обработчик для удаления песни по ID
    async deleteSongs(req, res) {
        try {
            const { _id } = req.query; // query для получения _id из параметров
            const song = await Song.findById(_id); // Используйте _id напрямую
            if (!song) {
                return res.status(404).json({ message: `Song with ${_id} not found` });
            }

            // Если песня найдена, удаляем её
            await song.deleteOne({_id});
            return res.json({ message: `Song with ${_id} deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    //обработчик добавления песни в список
    async postSongToList(req, res) {
        try {
            const { playlistId } = req.query;   //ищем key playlistId
            const { songId } = req.body;   // ищем songid в запросе
            // console.log(playlistId); 
            // console.log(songId); 
            const playlist = await Playlist.findById(playlistId);   //ищем данные в БД
            if (!playlist) {        //если не нашли вернули сообщение
                return res.status(404).json({message: "Playlist not found"})
            }
                // Проверяем, есть ли уже такая песня в плейлисте
            const songExists = playlist.songs.some((song) => song.equals(songId));

            if (songExists) {
            return res.status(400).json({ message: "Song already exists in the playlist" });
            }
            playlist.songs.push(songId);  //Добавляю песню в конец (push) списка
            await playlist.save()   //сохраняем в БД
            res.json({ message: 'Song added to the playlist' });  //вернули сообщение клиенту
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Post error'})
        }
    }

    // async getPlaylist(req, res) {
    //     try {
    //         const { _id } = req.query;
    //         console.log(`Received request with ${_id}`);
    //         const lists = await Playlist.find({userId: _id });
    
    //         if (!lists) {
    //             return res.status(404).json({ message: `Playlist not found` });
    //         }
    //         res.json(lists)
    //     } catch (e) {
    //         console.log(e)
    //         res.status(500).json({message: 'getPlayList error'})
    //     }
    // }


    async postPlaylist(req, res) {
        try {
          const { _id } = req.query;
          const { listName } = req.body;
          const existingPlaylist = await Playlist.findOne({ _id, listName });

          if (existingPlaylist) {
            // Если плейлист с таким именем уже существует, отправляем ошибку клиенту
            return res.status(400).json({ message: `Playlist with name "${listName}" already exists` });
          }
      
          // Если плейлист с таким именем не существует, создаем новый плейлист
          const newPlaylist = new Playlist({ userId: _id, listName: listName, songs: [] });
          await newPlaylist.save();
      
          // Отправляем сообщение об успешном создании
          return res.json({ message: `${listName} successfully saved` });
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: 'Server error' });
        }
    }
      

    // Обработчик для изменения листа по Id
    async updatePlaylist(req, res) {
        try {
            const { _id } = req.query;
            const updatedList = req.body; // обновленные данные листа из тела запроса
            //Заменяем найденый лист новым объектом
            const list = await Playlist.findByIdAndUpdate(_id, updatedList, { new: true });

            if (!list) {
                return res.status(400).json({ message: `List ${updatedList} not updated` });
            }

            res.json(list); // Отправьте обновленные в ответе
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
    
    // Обработчик для удаления PlayList по listName
    async deletePlaylist(req, res) {
        try {
            const { _id } = req.query; // query для получения id из параметров
            // console.log("Received deletePlaylist request with _id:", _id);
            const playlist = await Playlist.findById(_id); // Используйте _id напрямую
            if (!playlist) {
                return res.status(404).json({ message: `Playlist not found` });
            }
            // Если Playlist найден, удаляем
            // console.log("Playlist Id: ", _id, " deleted");
            await playlist.deleteOne({_id});
        
            return res.json({ message: `playlist deleted` });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }

    
    async getListWithSongs(req, res) {
        try {
            const { _id } = req.query;
            // console.log(`Received request getListWithSongs with ${_id}`);
            // Ищем плейлист пользователя по _id
            const playlists = await Playlist.find({userId: _id});
            if (!playlists || playlists.length === 0) {
                return res.status(404).json({ message: `Playlists not found for user ` });
            }
            // Создаем массив, в котором будем хранить все плейлисты с песнями и их деталями
            const allPlaylistsWithSongs = [];
            for (const playlist of playlists) {
                const playlistWithDetails = {
                    _id: playlist._id,
                    listName: playlist.listName,
                    songs: []
                };

                const songsInList = playlist.songs;
                // Получаем данные песен по id и добавляем их в массив плейлиста
                for (const songId of songsInList) {
                    const song = await Song.findById(songId);
                    playlistWithDetails.songs.push(song);
                }

                allPlaylistsWithSongs.push(playlistWithDetails);
            }
            //Возврат на клиент массива плейлистов с песнями и их деталями
            res.json({ playlists: allPlaylistsWithSongs })
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'getPlayList with details error'})
        }
    }

    // Обработчик для удаления Song из Playlist
    async deleteSongFromList(req, res) {
        try {
            const { playlistId, songId } = req.query; // query для получения id из параметров
            // console.log("Received delete song form Playlist request: ", playlistId, "song id: ", songId);
            const playlist = await Playlist.findById(playlistId); // Используйте _id напрямую
            if (!playlist) {
                return res.status(404).json({ message: `Playlist not found` });
            }
            if (!songId) {
                return res.status(400).json({ message: 'songId is required' });
            }    
            // Удаляем песню из массива songs в плейлисте
            const songIndex = playlist.songs.indexOf(songId);
            if (songIndex !== -1) {
                playlist.songs.splice(songIndex, 1);
                await playlist.save(); // Сохраняем обновленный плейлист
            }
        return res.json({ message: `Song deleted from the playlist` })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new authController()
