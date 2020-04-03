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

class Campaign extends Model { }
Campaign.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    cpName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpDescription: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    cpImage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    cpSize: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'medium'
    },

},
    {
        timestamps: false,
        tableName: 'campaign',
        sequelize,
        modelName: 'Campaign',

    });

// Tile.belongsTo(Campaign, { foreignKey: 'campaignId', targetKey: 'id' });



module.exports = Campaign;