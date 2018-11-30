

module.exports = (sequelize, DataTypes) => {

    const tasks = sequelize.define('tasks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: DataTypes.INTEGER,
        todo: DataTypes.STRING
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return tasks;

};