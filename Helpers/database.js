const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const index = require('./index');
const User = require('./../models').User;
const Todo = require('./../models').Todo;

module.exports = {

    users : [],
    tasks : [],
    dbPath : path.resolve(__dirname, '../db/database.db'),

    createUser : function (user, callback) {
        user.password = index.passwordHashing(user.password);
        User.create({
            username: user.username,
            password: user.password
        }).then(result => {
            callback(result);
        });
    },

    getUserByUsername : function (username, callback) {
        User.findOne({ where: {username: username} }).then(response => {
            callback(response);
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
        User.findOne({ where: {token: token} }).then(response => {
            if (response === null) {
                callback(-1);
            } else {
                callback(response.dataValues.id);
            }

        });
    },

    updateUserToken : function (username, userId, callback) {
        let token = index.createToken(username, userId);
        User.update(
            { token: token },
            { where: {id: userId} }
        ).then(response => {
            callback(token);
        });
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

    createTask : function (todo, callback) {
        Todo.create({
            user_id: todo.userId,
            content: todo.task
        }).then(result => {
            callback(result);
        });
    },

    getTasks : function (userId, callback) {
        Todo.findAll({ where: {user_id: userId} }).then(response => {
            let usersTasks = [];
            for (let i = 0; i < response.length; i++) {
                usersTasks.push({'id': response[i].dataValues.id, 'content': response[i].dataValues.content});
            }
            callback(usersTasks);
        });

    },

    DeleteToken : function (userId, callback) {
        User.update(
            { token: null },
            { where: {id: userId} }
        ).then(response => {
            callback("Success");
        });
    },

    deleteTask : function (taskId, callback) {
        Todo.destroy(
            { where: {id: taskId} }
        ).then(response => {
            callback("Success");
        });
    }
};

