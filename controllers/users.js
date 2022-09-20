const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const NOT_FOUND_ERROR = require('../errors/notFoundError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');
const CONFLICT_ERROR = require('../errors/conflictError');
const UNAUTHORIZED_ERROR = require('../errors/unauthorizedError');

const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Некорректный id пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BAD_REQUEST_ERROR('Некорректный id пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hashedPassword,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BAD_REQUEST_ERROR('Некорректные данные пользователя'));
            return;
          }
          if (err.name === 'MongoServerError') {
            next(new CONFLICT_ERROR('Пользователь с такими данными уже существует'));
            return;
          }
          next(err);
        });
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Некорректные данные пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NOT_FOUND_ERROR('Запрашиваемый пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BAD_REQUEST_ERROR('Некорректная ссылка на аватар пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UNAUTHORIZED_ERROR('Неверный email или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            const token = jwt.sign({
              _id: user._id,
            }, 'SOME-SECRET', { expiresIn: '7d' });

            res.cookie('jwt', token, {
              maxAge: 3600000,
              sameSite: true,
              httpOnly: true,
            });
            res.send({ data: user.toJSON() });
          }
        });
    })
    .catch(next);
};
