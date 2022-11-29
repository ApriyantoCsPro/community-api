// require('dotenv').config();

// const {
//   DB_USERNAME,
//   DB_PASSWORD,
//   DB_HOSTNAME,
//   DB_NAME,
//   DB_DIALECT,
// } = process.env


// module.exports = {
//   "development": {
//     "username": DB_USERNAME,
//     "password": DB_PASSWORD,
//     "database": DB_NAME,
//     "host": DB_HOSTNAME,
//     "dialect": DB_DIALECT
//   },
//   "test": {
//     "username": DB_USERNAME,
//     "password": DB_PASSWORD,
//     "database": DB_NAME,
//     "host": DB_HOSTNAME,
//     "dialect": DB_DIALECT
//   },
//   "production": {
//     "username": DB_USERNAME,
//     "password": DB_PASSWORD,
//     "database": DB_NAME,
//     "host": DB_HOSTNAME,
//     "dialect": DB_DIALECT
//   }
// }


const sequelize = require('sequelize')

const {DB_USERNAME, DB_NAME, DB_PASSWORD, DB_DIALECT} = process.env
const db = new sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  dialect: DB_DIALECT,
})

db.sync({})

module.exports = db