
const index = require('./index');

module.exports = {

    users : [],
    tasks : [],

    createUser : function (user) {
        user.password = index.passwordHashing(user.password);
        this.users.push(user);
    },

    getUserByUsername : function (username) {
        for (let i = 0; i < this.users.length; i++) {
            if (username === this.users[i].username) {
                return this.users[i];
            }
        }
        return null;
    },

    getUserIdByUsername : function (username) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return i;
            }
        }
        return -1;
    },

    getUserIdByToken : function (token) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].token === token) {
                return i;
            }
        }
        return -1;
    },

    updateUserToken : function (userId) {
        let token = index.createToken(this.users[userId].username, userId);
        this.users[userId].token = token;
        return token;
    },

    verifyUser : function (username, password) {
        for (let i = 0; i < this.users.length; i++) {
            if (username === this.users[i].username && index.verifyPassword(password, this.users[i].password)) {
                return this.users[i];
            }
        }
        return null;
    },

    createTask : function (task) {
        this.tasks.push(task);
    },

    getTasks : function (userId) {
        let usersTasks = [];
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].userId === userId) {
                usersTasks.push(this.tasks[i]);
            }
        }
        return usersTasks;
    },
};

