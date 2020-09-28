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

(async () => {
  await sequelize.sync({ force: true });

  try {
    // Instance of the Movie class represents a database row
    const book = await Book.create({
      title: 'Toy Story',
      author: 'Mat',
    });
    console.log(book.toJSON());

  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }     
})();