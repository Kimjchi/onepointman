'use strict';

var squel = require("squel");
var promise = require('bluebird');
var options = { promiseLib: promise };
var pgp = require('pg-promise')(options);

var express = require('express'); // require Express
var router = express.Router(); // setup usage of the Express router engine

/* PostgreSQL and PostGIS module and connection setup */
var pg = require("pg"); // require Postgres module


// Setup connection
var db = {};
var username = "postgres"; // sandbox username
var password = "root"; // read only privileges on our table
var host = "localhost";
var database = "postgres"; // database name
var database_port = '5433';
var conString = "postgres://" + username + ":" + password + "@" + host + ':' + database_port + "/" + database; // Your Database Connection

// Set up your database query to display GeoJSON
var query = 'SELECT now()';

var client = new pg.Client(conString);
client.connect();

var DB = pgp(conString);

DB.query(squel.select().field('NOW()').toString()).then(function (res) {
    console.log('time is', res[0].now);
}).catch(function (e) {
    console.error('query error', e.message, e.stack);
}).catch(function (err) {
    console.error('Unable to connect to the database', err);
});

/*client.query(query, function (row, result) {
    console.log(result.rows[0].now);
});*/

module.exports = DB;
//# sourceMappingURL=index.js.map