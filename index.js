/**
 * @author "Fabio Cigliano"
 * @created 01/09/18
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

let server = false;
let app = express()
app.use(cors())
app.use(bodyParser.json())

app.use(express.static("./"))

// Or you can simply use a connection uri
/*
CREATE DATABASE dbname;
CREATE ROLE utente LOGIN PASSWORD 'pass';
GRANT CONNECT ON DATABASE dbname TO utente;
GRANT USAGE ON SCHEMA config TO utente;
GRANT ALL PRIVILEGES ON TABLE config TO utente;
create table config
(
  id    serial not null
    constraint config_pkey
    primary key,
  title varchar(255)
);
 */
const database = new Sequelize('postgres://utente:pass@localhost:5432/dbname')

app.get('/api/data/get', function (req, res, next) {
  database.query("SELECT title FROM config LIMIT 1", { type: Sequelize.QueryTypes.SELECT})
    .then(function (results) {
      console.log('SQL data', results);

      res.json({
        title: results[0].title
      })
    })
    .catch(function (err) {
      res.json({
        title: err.message
      })
    })
})

module.exports = {
  open: function () {
    return database
      .sync({ force: true })
      .then(function () {
        server = app.listen(8080, function () {
          console.log('API listening to port localhost:8080')
        })
      });
  },
  close: function () {
    server && server.close();
    database.close();
  }
}
