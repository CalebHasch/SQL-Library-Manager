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
  let pages = [1, 2]
  //Pagination function
  function pagination(list, page) {
    const booksPerPage = 10;
    let startIndex = page * booksPerPage - booksPerPage;
    let endIndex = page * booksPerPage;
    let bookList = []
    for (let i = 0; i < list.length; i++) {
      if (i >= startIndex && i < endIndex) {
        bookList.push(list[i]);
      }
    }
    console.log(bookList.length);
    res.render('index', { books: bookList, pages });
  }
  
  //console.log(books[1].dataValues.year);

  //search function
  function search(searchInput) {
    let bookResults = [];
    for (let i = 0; i < books.length; i++) {
      if(books[i].dataValues.title.toLowerCase().includes(searchInput.toLowerCase())) {
        bookResults.push(books[i]);
      } else if(books[i].dataValues.author.toLowerCase().includes(searchInput.toLowerCase())) {
        bookResults.push(books[i]);
      } else if(books[i].dataValues.genre.toLowerCase().includes(searchInput.toLowerCase())) {
        bookResults.push(books[i]);
      // } else if(books[i].dataValues.year.includes(searchInput.toLowerCase())) {
      //   bookResults.push(books[i]);
      }
    }
    console.log(bookResults.length);
    //res.render('index', { books: books, title: 'Books'});
  }
  //search('fiction');
  pagination(books, 1);
}));

// Search Route
//router.get('/search', (req, res) => {})

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
router.get('/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', { book, title: 'Update Book'});
  } else {
    const err = new Error();
    err.status = 404;
    err.message = `Looks like the quote you requested doesn't exist.`
    next(err);  }
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
      res.redirect('/');
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