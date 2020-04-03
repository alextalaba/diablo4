const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('hag', 'root', 'root', {
    dialect: 'mysql',
    host: 'localhost',
});

const Character = require('./character');
const Tile = require('./tile');

async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

class Item extends Model { }
Item.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
},
    {
        timestamps: false,
        tableName: 'item',
        sequelize,
        modelName: 'Item',

    });




// Item.sync({ alter: true });

module.exports = Item;