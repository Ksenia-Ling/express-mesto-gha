const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/me', getUserMe);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

userRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)([a-z.]{2,6})([/\w.-]*)*\/?$/),
  }),
}), updateAvatar);

userRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

module.exports = userRoutes;
