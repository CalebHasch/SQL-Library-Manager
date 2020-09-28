const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

// view engine setup
app.set('views', path.join(_dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(_dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// catch 404 
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || "There's been an error on the server";
  res.locals.error = err;
  res.status(err.status);
  if (err.status === 404) {
    console.log(`This page does not exist: ${err.status} ${err.message}`);
    res.render('page-not-found', {err});
  } else {
    res.render('error', {err});
  }
});

module.exports = app;