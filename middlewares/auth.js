const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SOME-SECRET');
  } catch (err) {
    next(new UNAUTHORIZED_ERROR('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
