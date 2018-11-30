

module.exports = (sequelize, DataTypes) => {

    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return users;

};
