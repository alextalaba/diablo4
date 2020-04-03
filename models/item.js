const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('heroku_bc9866ebbed68b0', 'bc61100f7ed2c3', '13d1bd82', {
    host: 'eu-cdbr-west-02.cleardb.net',
    dialect: 'mysql'
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