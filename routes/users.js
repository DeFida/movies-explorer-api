const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateMe,
  getMe,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateMe);

module.exports = router;
