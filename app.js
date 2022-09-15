const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { NOT_FOUND_ERROR } = require('./constants/errors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6314f94214260b947e00ac11',
//   };
//   next();
// });

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use('*', (req, res, next) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая страница не найдена' });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
