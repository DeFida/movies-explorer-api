const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
  },
  director: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле обязательно для заполнения'],
  },
  year: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    length: 4,
  },
  description: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
  },
  image: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/.test(v);
      },
      message: (props) => `${props.value} не корректная ссылка`,
    },
  },
  trailer: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/.test(v);
      },
      message: (props) => `${props.value} не корректная ссылка`,
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/.test(v);
      },
      message: (props) => `${props.value} не корректная ссылка`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    required: [true, 'Поле обязательно для заполнения'],
    type: Number,
  },
  nameRU: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле обязательно для заполнения'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
