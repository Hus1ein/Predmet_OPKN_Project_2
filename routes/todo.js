let express = require('express');
let database = require('../Helpers/database');
let router = express.Router();



/* GET todo page. */
router.get('/', function(req, res, next) {
    if (req.body.uid !== null) {
        let currentUserId = database.getUserIdByToken(req.body.uid);
        if (currentUserId > -1) {
            let userTasksList = database.getTasks(currentUserId);
            res.render('todo', {'taskList': userTasksList});
        } else {
            res.render('error', {'message': 'Error: You are not authorized to perform this action'})
        }

    } else {
        res.render('error', {'message': 'You are not authorized to perform this action'});
    }
});

/* POST todo page. */
router.post('/', function(req, res, next) {
    if (req.body.uid !== null){

        let currentUserId = database.getUserIdByToken(req.body.uid);
        if (currentUserId > -1) {
            let task = req.body.task;
            if (task === ""){
                res.redirect('/todo');
                return;
            }
            database.createTask({'userId': currentUserId, 'task': task});
            res.redirect('/todo');
        } else {
            res.render('error', {'message': 'You are not authorized to perform this action'});
        }


    } else {
        res.render('error', {'message': 'You are not authorized to perform this action'});
    }

});

module.exports = router;
