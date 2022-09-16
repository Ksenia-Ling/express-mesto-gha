const FORBIDDEN_ERROR = require('../errors/forbidenError');
const NOT_FOUND_ERROR = require('../errors/notFoundError');
const BAD_REQUEST_ERROR = require('../errors/badRequestError');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BAD_REQUEST_ERROR('Некорректные данные карточки');
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Запрашиваемая карточка не найдена');
      }
      if (card.owner.toString() !== owner) {
        throw new FORBIDDEN_ERROR('Удалять карточки может только их владелец');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BAD_REQUEST_ERROR('Некорректный id пользователя');
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BAD_REQUEST_ERROR('Некорректные данные');
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BAD_REQUEST_ERROR('Некорректные данные');
      }
      next(err);
    });
};
