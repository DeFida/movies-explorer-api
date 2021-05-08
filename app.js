const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const indexRouter = require('./routes/index');
const limiter = require('./middlewares/limiter');

const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);
app.use(requestLogger);
app.use(indexRouter);

app.use((_req, _res, next) => {
  next(new NotFoundError('Не найдено!'));
});

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  const date = new Date();
  console.log(`App listening on port http://127.0.0.1:${PORT}\n${date.toString()}`);
});
