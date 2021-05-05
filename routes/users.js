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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateMe);

module.exports = router;
