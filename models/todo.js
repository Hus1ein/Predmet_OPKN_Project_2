'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    user_id: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  Todo.associate = function(models) {
    // associations can be defined here
  };
  return Todo;
};