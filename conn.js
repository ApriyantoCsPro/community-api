const mysql = require("mysql");
const util = require("util");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "apriyanto",
  database: "facebook",
});

con.connect(function (err) {
  if (err) throw err;
});

const query = util.promisify(con.query).bind(con);

module.exports = query;
