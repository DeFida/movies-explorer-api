const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, addMovie, deleteMovieById } = require('../controllers/movies');

const auth = require('../middlewares/auth');

router.use(auth);

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/),
    trailer: Joi.string().required().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/),
    thumbnail: Joi.string().required().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovieById);

module.exports = router;
