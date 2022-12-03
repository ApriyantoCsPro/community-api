const Sequelize = require('sequelize')
const config = require('../config/config')

  const Comment = config.define('comments', {
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
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
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

module.exports = Comment
