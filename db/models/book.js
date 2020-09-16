const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notNull: {
          msg: 'Please provide a value'
        },
        notEmpty: {
          msg: 'Please fill out',
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notNull: {
          msg: 'Please provide a value'
        },
        notEmpty: {
          msg: 'Please fill out',
        }
      }
    },
    genre: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    }
  })
}