const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CastError = require('../errors/cast-err');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV } = process.env;

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  console.log('deded')
  const {
    name, email, password,
  } = req.body;
  if (!password || !email) {
    return next(new CastError('Email или пароль не могут быть пустыми'));
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      }))
      .catch((err) => {
        let error;
        if (err.name === 'MongoError' && err.code === 11000) {
          error = new ConflictError('Пользователь существует');
        } else if (err.name === 'CastError') {
          error = new CastError('Переданы некорректные данные');
        } else if (err.name === 'ValidationError') {
          error = new ValidationError('Ошибка валидации');
        } else if (err.name === 'DocumentNotFoundError') {
          error = new NotFoundError('Пользователь не найден');
        }
        next(error);
      }));
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};


module.exports.updateMe = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      let error;
      if (err.name === 'CastError') {
        error = new CastError('Переданы некорректные данные');
      } else if (err.name === 'ValidationError') {
        error = new ValidationError('Ошибка валидации');
      } else if (err.name === 'DocumentNotFoundError') {
        error = new NotFoundError('Пользователь не найден');
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'd4fghsdf$%4dffgh/56sd1f5h447', { expiresIn: '7d' });
      res.cookie('jwt', token, { httpOnly: true, sameSite: true, maxAge: 3600000 * 7 * 24 }).send({ token });
    })
    .catch(next);
};
