const express = require('express');

const userRoutes = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/:userId', getUserById);
userRoutes.post('/users', createUser);
userRoutes.patch('/users/me', updateProfile);
userRoutes.patch('/users/me/avatar', updateAvatar);

module.exports = userRoutes;
