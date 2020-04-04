const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('heroku_bc9866ebbed68b0', 'bc61100f7ed2c3', '13d1bd82', {
    host: 'eu-cdbr-west-02.cleardb.net',
    dialect: 'mysql'
});

class Battle extends Model { }
Battle.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    heroId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enemyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    won: {
        type: DataTypes.STRING,
        allowNull: true
    },
    background: {
        type: DataTypes.STRING,
        allowNull: true
    }

},
    {
        timestamps: false,
        tableName: 'battle',
        sequelize,
        modelName: 'Battle',

    });


// Battle.sync({ alter: true });

module.exports = Battle;