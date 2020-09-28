const express = require('express');
const book = require('../models/book');
const router = express.Router();
const Book = require('.../models').Book;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// Get all books
router.get('/', asyncHandler(async (req, res) => {
  const books = await books.findall();
  res.render("books/index", { books, title: "Sequelize-It!" });
}));

// Create a new book
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book" });
});

// Post created book
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try{
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    } 
  }
}))

// Get individual book
router.get("/:id", asyncHandler(async (req, res) => {
  const Book= await Book.findByPk(req.params.id);
  if(Book) {
    res.render("Books/show", { Book, title: Book.title});
  } else {
    res.sendStatus(404);
  }
}));

// Update a book
router.post("/:id/edit", asyncHandler(async (req, res) => {
  let Book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/edit", { book, error: error.errors, title: "Edit Book" });
    } else {
      throw error;
    }
  }
}));

// Delete individual book
router.post("/:id/delete", asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
})); 

module.exports = router;