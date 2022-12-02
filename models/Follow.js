const Sequelize = require('sequelize')
const config = require('../config/config')

  const Follow = config.define('follows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      target_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },
    {
      timestamps: false
    },
    {
      freezeTableName: true
    },
  );

module.exports = Follow
