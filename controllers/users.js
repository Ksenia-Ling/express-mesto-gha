const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { NOT_FOUND_ERROR, BAD_REQUEST_ERROR, SERVER_ERROR } = require('../constants/errors');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(SERVER_ERROR)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный id пользователя' });
      } else {
        res.status(SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.getUserMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный id пользователя' });
      } else {
        res.status(SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
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
            res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные пользователя' });
          } else {
            res.status(SERVER_ERROR)
              .send({ message: 'Произошла ошибка на сервере' });
          }
        });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR)
          .send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректная ссылка на аватар пользователя' });
      } else {
        res.status(SERVER_ERROR)
          .send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь с такими данными не найден'))
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
          } else {
            res.status(401).send({ message: 'Неверный email или пароль' });
          }
        });
    })
    .catch(next);
};
