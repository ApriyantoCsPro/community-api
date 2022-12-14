const Sequelize = require('sequelize')
const config = require('../config/config')

  const Follow = config.define('follows', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      followee_id: {
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
