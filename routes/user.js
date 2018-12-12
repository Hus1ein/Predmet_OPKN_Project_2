let express = require('express');
let database = require('../Helpers/database');
let router = express.Router();

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
var Sequelize = require('sequelize');

let dbPath = path.resolve(__dirname, '../db/database.sqlite');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

/* POST login page. */
router.post('/login', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    if (username !== "" && password !== "") {
        database.verifyUser(username, password, function (currentUser) {
            let userToken = undefined;
            if (currentUser !== null) {

                if (currentUser.token !== null && currentUser.token !== undefined) {
                    userToken = currentUser.token;
                    res.cookie('uid', userToken);
                    res.redirect('../todo');
                } else {
                    database.updateUserToken(username, currentUser.id, function (respone) {
                        userToken = respone;
                        res.cookie('uid', userToken);
                        res.redirect('../todo');
                    });
                }

            } else {
                res.render('notRegistered');
            }

        });
    } else {
        res.render('home');
    }

});

/* POST sign up page. */
router.post('/signup', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    if (username !== "" && password !== ""){
        database.getUserByUsername(username, function (result) {
            if (result !== null) {
                res.render('alreadyRegistered', {'username': username});
            } else {
                database.createUser({'username' : req.body.username, 'password' : password}, function (user) {
                    console.log("hussain");
                    database.updateUserToken(username, user.id, function (response) {
                        console.log(response);
                        let userToken = response;
                        res.cookie('uid', userToken);
                        res.render('greetingMessage', {'username': username});
                    });
                });
            }
        });

    } else {
        res.render('home');
    }

});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
    database.getUserIdByToken(req.body.uid, function (userId) {
        database.DeleteToken(userId, function (response) {
            res.clearCookie('uid');
            res.redirect('../');
        });
    });
});

module.exports = router;
