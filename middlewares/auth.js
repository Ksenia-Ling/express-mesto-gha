const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SOME-SECRET');
  } catch (err) {
    throw new UNAUTHORIZED_ERROR('Необходима авторизация');
  }

  req.user = payload;

  return next();
};

module.exports = auth;
