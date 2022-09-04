const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  console.log(req.user._id);

  Card.create({ name, link })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(err => res.status(500)
      .send({ message: 'Произошла ошибка на сервере' }));
};