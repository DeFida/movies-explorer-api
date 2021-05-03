const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateMe,
  updateAva,
  getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateMe);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)([\da-z.-]+)\.([a-z]{2,6})([/\w\W.-]*)#?$/),
  }),
}), updateAva);
module.exports = router;
