let express = require('express');
let router = express.Router();

let users = [];
let todo = [{'userId': 0, "note": "First note"}, {'userId': 0, "note": "Second note"}];
let loggedInUser = undefined;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Express' });
});

/* POST login page. */
router.post('/login', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    for (let i = 0; i < users.length; i++) {
        if (username ===users[i].username && password === users[i].password) {
            loggedInUser = i;
            res.redirect('../todo');
            return;
        }
    }
    res.render('notRegistered');


});

/* POST sign up page. */
router.post('/signup', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    for (let i = 0; i < users.length; i++) {
        if (username ===users[i].username) {
            res.render('alreadyRegistered', {'username': username});
            return;
        }
    }
    users.push({'username': username, 'password': password});
    loggedInUser = users.length - 1;
    res.render('greetingMessage', {'username': username});
});

router.get('/todo', function(req, res, next) {
    let userTodoList = [];
    for (let j = 0; j < todo.length; j++){
        if (todo[j].userId === loggedInUser){
            userTodoList.push(todo[j]);
        }
    }
    console.log(userTodoList);
    res.render('todo', {'todoList': userTodoList});
});

router.post('/todo', function(req, res, next) {
    let note = req.body.note;
    todo.push({'userId': loggedInUser, 'note': note});
    res.redirect('../todo');
});
router.get('/logout', function(req, res, next) {
    loggedInUser = undefined;
    res.redirect('../');
});
module.exports = router;
