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
    range: {
        type: DataTypes.INTEGER,
        allowNull: true
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