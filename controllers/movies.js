const CastError = require('../errors/cast-err');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const Movie = require('../models/movie');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country, director, duration, year,
    description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      let error;
      if (err.name === 'CastError') {
        error = new CastError('Переданы некорректные данные');
      } else if (err.name === 'ValidationError') {
        error = new ValidationError('Ошибка валидации');
      }
      next(error);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .then((found) => {
      if (found === null) {
        const error = new NotFoundError('Такого фильма нет');
        next(error);
        return;
      }
      if (found.owner.toString() === userId) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((movie) => res.status(200).send({ data: movie }))
          .catch((err) => {
            let error;
            if (err.name === 'CastError') {
              error = new CastError('Некорректные данные');
            } else if (err.name === 'DocumentNotFoundError') {
              error = new NotFoundError('Такого фильма нет');
            }
            next(error);
          });
      } else {
        next(new ForbiddenError('Запрещено!'));
      }
    })
    .catch((err) => {
      let error;
      if (err.name === 'DocumentNotFoundError') {
        error = new NotFoundError('Такого фильма нет');
      }
      next(error);
    });
};
