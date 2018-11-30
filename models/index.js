
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
var Sequelize = require('sequelize');

let dbPath = path.resolve(__dirname, '../db/database.sqlite');
    
var sequelize = new Sequelize('database', null, null, {
    dialect: "sqlite",
    storage: dbPath,
});

sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });


//  MODELS
var User = sequelize.define('User', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});


//  SYNC SCHEMA
sequelize
    .sync({ force: true })
    .then(function(err) {
        console.log('It worked!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });