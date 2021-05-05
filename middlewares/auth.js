const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/auth-err');

const handleAuthError = () => new AuthError('Необходима авторизация');
const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'd4fghsdf$%4dffgh/56sd1f5h447');
  } catch (err) {
    return next(handleAuthError());
  }

  req.user = payload;
  next();
};

module.exports = auth;
