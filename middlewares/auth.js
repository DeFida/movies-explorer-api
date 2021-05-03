const jwt = require('jsonwebtoken');

const AuthError = require('../errors/auth-err');

const JWT_SECRET = 'd4fghsdf$%4dffgh/56sd1f5h447';
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
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(handleAuthError());
  }

  req.user = payload;
  next();
};

module.exports = auth;
