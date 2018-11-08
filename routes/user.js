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
        let currentUser = database.verifyUser(username, password);
        let userToken = undefined;
        if (currentUser !== null) {

            if (currentUser.token !== undefined) {
                userToken = currentUser.token;
            } else {
                let currentUserId = database.getUserIdByUsername(currentUser.username);
                userToken = database.updateUserToken(currentUserId);
            }

            res.cookie('uid', userToken);
            res.redirect('../todo');
            return;
        }
        res.render('notRegistered');
    } else {
        res.render('home');
    }

});

/* POST sign up page. */
router.post('/signup', function(req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    if (username !== "" && password !== ""){
        let user = database.getUserByUsername(username);
        if (user !== null) {
            res.render('alreadyRegistered', {'username': username});
            return;
        }

        database.createUser({'username' : username, 'password' : password});
        let currentUserId = database.getUserIdByUsername(username);
        let userToken = database.updateUserToken(currentUserId);
        res.cookie('uid', userToken);
        res.render('greetingMessage', {'username': username});
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
