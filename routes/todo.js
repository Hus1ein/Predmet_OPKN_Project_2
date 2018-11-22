let express = require('express');
let database = require('../Helpers/database');
let router = express.Router();



/* GET todo page. */
router.get('/', function(req, res, next) {
    if (req.body.uid !== null) {
        database.getUserIdByToken(req.body.uid, function (currentUserId) {
            if (currentUserId > -1) {
                database.getTasks(currentUserId, function (userTasksList) {
                    console.log(userTasksList);
                    res.render('todo', {'taskList': userTasksList});
                });
            } else {
                res.render('error', {'message': 'Error: You are not authorized to perform this action'})
            }
        });
    } else {
        res.render('error', {'message': 'You are not authorized to perform this action'});
    }
});

/* POST todo page. */
router.post('/', function(req, res, next) {
    if (req.body.uid !== null){

        database.getUserIdByToken(req.body.uid, function (currentUserId) {
            if (currentUserId > -1) {
                let task = req.body.task;
                if (task === ""){
                    res.redirect('/todo');
                } else {
                    database.createTask({'userId': currentUserId, 'task': task});
                    res.redirect('/todo');
                }
            } else {
                res.render('error', {'message': 'You are not authorized to perform this action'});
            }
        });

    } else {
        res.render('error', {'message': 'You are not authorized to perform this action'});
    }

});

module.exports = router;
