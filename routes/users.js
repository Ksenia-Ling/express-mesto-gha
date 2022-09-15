const express = require('express');

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  getUserMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/:userId', getUserById);
userRoutes.get('./users/me', getUserMe);
userRoutes.patch('/users/me', updateProfile);
userRoutes.patch('/users/me/avatar', updateAvatar);

module.exports = userRoutes;
