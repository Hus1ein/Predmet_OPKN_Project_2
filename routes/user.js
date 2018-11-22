let express = require('express');
let database = require('../Helpers/database');
let router = express.Router();

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

                if (currentUser.token !== undefined) {
                    userToken = currentUser.token;
                } else {
                    let userToken = database.updateUserToken(username, currentUser.id);
                    res.cookie('uid', userToken);
                    res.render('greetingMessage', {'username': username});
                }
                res.cookie('uid', userToken);
                res.redirect('../todo');
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
                database.createUser({'username' : username, 'password' : password});
                database.getUserIdByUsername(username, function (userId) {
                    if (userId !== -1) {
                        let userToken = database.updateUserToken(username, userId);
                        res.cookie('uid', userToken);
                        res.render('greetingMessage', {'username': username});
                    }
                });

            }
        });

    } else {
        res.render('home');
    }

});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
    res.clearCookie('uid');
    res.redirect('../');
});

module.exports = router;
