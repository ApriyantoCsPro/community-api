const sequelize = require('sequelize')

const {DB_USERNAME, DB_NAME, DB_PASSWORD, DB_DIALECT} = process.env
const db = new sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
})

db.sync({})

module.exports = db