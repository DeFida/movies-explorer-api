const express = require('express')
require('dotenv').config();

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');

const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');

const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use(errorLogger);
app.use((_req, _res, next) => {
  next(new NotFoundError('Не найдено!'));
});
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const { statusCode = 500, message } = err;
  console.log(err);
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});


app.listen(PORT, () => {
  const date = new Date();
  console.log(`App listening on port http://127.0.0.1:${PORT}\n${date.toString()}`);
});
