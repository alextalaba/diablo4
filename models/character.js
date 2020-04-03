const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('heroku_bc9866ebbed68b0', 'bc61100f7ed2c3', '13d1bd82', {
    host: 'eu-cdbr-west-02.cleardb.net',
    dialect: 'mysql'
});

async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

class Character extends Model { }
Character.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cls: {
        type: DataTypes.STRING,
        allowNull: false
    },
    spec: {
        type: DataTypes.STRING,
        allowNull: true
    },
    attack: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    health: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currentHealth: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    imgIdle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imgDead: {
        type: DataTypes.STRING,
        allowNull: true
    }

},
    {
        timestamps: false,
        tableName: 'character',
        sequelize,
        modelName: 'Character',

    });


// Character.sync({ alter: true });

module.exports = Character;