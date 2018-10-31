let express = require('express');
let router = express.Router();

let users = [];
let todo = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

/* POST login page. */
router.post('/login', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if (username !== "" && password !== "") {
        for (let i = 0; i < users.length; i++) {
            if (username === users[i].username && password === users[i].password) {
                res.cookie('username', username);
                res.redirect('../todo');
                return;
            }
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
        for (let i = 0; i < users.length; i++) {
            if (username === users[i].username) {
                res.render('alreadyRegistered', {'username': username});
                return;
            }
        }
        users.push({'username': username, 'password': password});
        res.cookie('username', username);
        res.render('greetingMessage', {'username': username});
    } else {
        res.render('home');
    }

});

/* GET todo page. */
router.get('/todo', function(req, res, next) {
    if (req.body.currentUser !== null) {
        let currentUserId = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === req.body.currentUser) {
                currentUserId = i;
            }
        }
        let userTodoList = [];
        for (let j = todo.length - 1; j >= 0; j--) {
            if (todo[j].userId === currentUserId) {
                userTodoList.push(todo[j]);
            }
        }
        res.render('todo', {'todoList': userTodoList});
    } else {
        res.render('error', {'message': 'Error: You are not authorized to perform this action'})
    }
});

/* POST todo page. */
router.post('/todo', function(req, res, next) {
    if (req.body.currentUser !== null){

        let currentUserId = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === req.body.currentUser) {
                currentUserId = i;
            }
        }

        let note = req.body.note;
        if (note === ""){
            res.redirect('../todo');
            return;
        }
        todo.push({'userId': currentUserId, 'note': note});
        res.redirect('../todo');
    } else {
        res.render('error', {'message': 'Error: You are not authorized to perform this action'})
    }

});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
    res.clearCookie('username');
    res.redirect('../');
});


module.exports = router;
