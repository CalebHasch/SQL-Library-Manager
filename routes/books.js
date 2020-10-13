const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Sequelize } = require('../models');
const Op = Sequelize.Op;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      console.log(error)
      res.status(500).send(error)
    }
  }
}

// Get all books
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' });
}));

// Create a new book
router.get('/new', (req, res) => {
  res.render('new-book', { book: {}, title: 'New Book' });
});

// Post created book
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('new-book', { book, errors: error.errors, title: 'New Book' });
    } else {
      throw error;
    }
  }
}));

//Update Book form
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book, title: 'Update Book'});
  } else {
    res.sendStatus(404);
  }
}))


// Update a book
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('update-book', { book, errors: error.errors, title: 'Update Book' });
    } else {
      throw error;
    }
  }

}));

// Delete individual book
router.post('/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.sendStatus(404);
  }
})); 

module.exports = router;