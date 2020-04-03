const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('heroku_ab7d505eba761a9', 'bb173a92295bca', 'f3fcdae1', {
    host: 'us-cdbr-iron-east-01.cleardb.net',
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

class Ability extends Model { }
Ability.init({
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    target: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modifier1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modifier2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    healthChange: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    attackChange: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    manaChange: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    animation: {
        type: DataTypes.STRING,
        allowNull: true
    }

},
    {
        timestamps: false,
        tableName: 'ability',
        sequelize,
        modelName: 'Ability',

    });



// Ability.sync({ alter: true });

module.exports = Ability;