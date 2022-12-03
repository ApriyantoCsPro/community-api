const Sequelize = require('sequelize')
const config = require('../config/config')

  const Post = config.define('posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER, 
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted: {
        type: Sequelize.DATE,
        allowNull: true
      },
    },
    {
      freezeTableName: true
    }
  );

module.exports = Post
