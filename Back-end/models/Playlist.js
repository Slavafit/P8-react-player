const { Schema, model, Types } = require('mongoose')

const Playlist = new Schema({
    // userId: { type: Types.ObjectId, required: true }, // Идентификатор пользователя, владельца плейлиста
    userName: { type: String, required: true }, // имя владельца плейлиста
    listName: { type: String, unique: true, required: true }, // Название плейлиста
    songs: [{ type: Types.ObjectId, ref: 'Song' }] // коллекция модели Song
  });

module.exports = model('Playlist', Playlist)