const Sequelize = require('sequelize')
const config = require('../config/config')

  const Like = config.define('likes', {
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
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      target_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
    },
    {
      timestamps: false
    },
    {
      freezeTableName: true
    },
  );

module.exports = Like
