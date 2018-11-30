const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const index = require('./index');
const Sequelize = require('sequelize');
const dbPath = path.resolve(__dirname, '../db/database.sqlite');

module.exports = () => {

    let sequelize = new Sequelize('database', null, null, {
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

    const Users = require('./../models/users')(sequelize, Sequelize);
    const Tasks = require('./../models/tasks')(sequelize, Sequelize);

    //  SYNC SCHEMA
    sequelize
        .sync({ force: false })  // Don't DROP TABLE IF EXISTS
        .then(function(err) {
            console.log('It worked!');
        }, function (err) {
            console.log('An error occurred while creating the table:', err);
        });

    return sequelize;

};

/*
module.exports = {

    users : [],
    tasks : [],
    dbPath : path.resolve(__dirname, '../db/database.db'),

    test : function () {
        var sequelize = new Sequelize('database', 'username', 'password', {
            host: 'localhost',
            dialect: 'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            // SQLite only
            storage: 'path/to/database.sqlite'
        });
    },

    initTables : function () {

        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let createUsersTable = 'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), password VARCHAR(30), token text)';
        let createItemsTable = 'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, task TEXT)';

        db.run(createUsersTable);
        db.run(createItemsTable);

        db.close();
    },


    createUser : function (user) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        user.password = index.passwordHashing(user.password);
        let insertNewUserQuery = 'INSERT INTO users (username, password) VALUES("' + user.username + '", "' + user.password + '")';
        db.run(insertNewUserQuery);
        db.close();
        console.log("hello");
    },

    getUserByUsername : function (username, callback) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let getUserQuery = 'SELECT * FROM users WHERE username="' + username + '";';
        db.get(getUserQuery, (err, row) => {
            if (row !== undefined) {
                callback({'id': row.id, 'username': row.username, 'password': row.password, 'token': row.token});
            } else {
                callback(null);
            }
            db.close();
        });
    },

    getUserIdByUsername : function (username, callback) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let getUserQuery = 'SELECT * FROM users WHERE username="' + username + '";';
        console.log("hussain");
        db.get(getUserQuery, (err, row) => {
            let userId = -1;
            console.log(getUserQuery);
            if (row !== undefined) {
                userId = row.id;
            }
            callback(userId);
            db.close();
        });

    },

    getUserIdByToken : function (token, callback) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let getUserQuery = 'SELECT id FROM users WHERE token="' + token + '";';
        db.get(getUserQuery, function (err, row) {
            if (row !== undefined) {
                callback(row.id);
            } else {
                callback(-1);
            }
            db.close();
        });
    },

    updateUserToken : function (username, userId) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let token = index.createToken(username, userId);
        let updateUserTokenQuery = 'UPDATE users SET token="' + token + '" WHERE id="' + userId + '";';
        db.run(updateUserTokenQuery);

        db.close();
        return token;
    },

    verifyUser : function (username, password, callback) {
        this.getUserByUsername(username, function (user) {
           if (user !== null) {
               if (index.verifyPassword(password, user.password)) {
                   callback(user);
               } else {
                   callback(null);
               }
           } else {
               callback(null);
           }
        });
    },

    createTask : function (todo) {
        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let insertNewTaskQuery = 'INSERT INTO items (user_id, task) VALUES("' + todo.userId + '", "' + todo.task + '")';
        db.run(insertNewTaskQuery);

        db.close();
    },

    getTasks : function (userId, callback) {

        let db = new sqlite3.Database(this.dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        let getTasksQuery = 'SELECT task FROM items WHERE user_id="' + userId + '";';
        db.all(getTasksQuery, [], (err, rows) => {
            let usersTasks = [];
            for (let i = 0; i < rows.length; i++) {
                usersTasks.push(rows[i].task);
            }
            callback(usersTasks);
            db.close();
        });

    },
};

*/
