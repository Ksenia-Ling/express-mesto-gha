const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {

  User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      res.status(404)
        .send({ message: 'Запрашиваемый пользователь не найден' });
      return;
    }
    res.send(user);
  })
  .catch(err => res.status(500)
    .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
  .then(user => res.send({ data: user }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
  .then(user => res.send({ data: user }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};