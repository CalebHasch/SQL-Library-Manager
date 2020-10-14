const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

const { sequelize, Book } = require('./models');

(async () => {
  console.log('Testing the connection to the database...');
  try {
    await sequelize.authenticate();
    console.log('Connection successfull');
  } catch (error) {
    console.error('Connection Failed');
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 
app.use( (req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = `Page not found.`
  res.render('page-not-found', {error});
});

// error handler
app.use( (err, req, res, next) => {
  if(err.status === 404) {
    res.status(404).render('page-not-found', {err});
  } else {
    err.message = err.message || `Oops! It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', {err});
  }
});


module.exports = app;