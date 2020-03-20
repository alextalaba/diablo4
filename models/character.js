const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('hag', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});

const Tile = require('./tile');

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
    charName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    charClass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    charSpec: {
        type: DataTypes.STRING,
        allowNull: false
    },
    charAttack: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    charHealth: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

},
    {
        timestamps: false,
        tableName: 'character',
        sequelize,
        modelName: 'Character',

    });

Tile.belongsToMany(Character, {
    as: 'Tile',
    through: 'Tile_Character',
    foreignKey: 'Tile_rowId'
});

Character.belongsToMany(Tile, {
    as: 'Character',
    through: 'Tile_Character',
    foreignKey: 'Character_rowId'
});

// Character.sync({ alter: true });

module.exports = Character;