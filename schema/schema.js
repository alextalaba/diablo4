const graphql = require('graphql');


const Character = require('../models/character');
const Campaign = require('../models/campaign');
const Tile = require('../models/tile');
const Item = require('../models/item');


const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLNonNull, GraphQLList } = graphql;
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('hag', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});


Character.sync();
Campaign.sync();
Tile.sync();
Item.sync();

// Character.sync({ alter: true });
// Campaign.sync({ alter: true });
// Tile.sync({ alter: true });
// Item.sync({ alterF: true });

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: () => ({
        id: { type: GraphQLID },
        charName: { type: GraphQLString },
        charClass: { type: GraphQLString },
        charSpec: { type: GraphQLString },
        charAttack: { type: GraphQLInt },
        charHealth: { type: GraphQLInt },
    })
});

const CampaignType = new GraphQLObjectType({
    name: 'Campaign',
    fields: () => ({
        id: { type: GraphQLID },
        cpName: { type: GraphQLString },
        cpDescription: { type: GraphQLString },
        cpImage: { type: GraphQLString },
        cpSize: { type: GraphQLString },
    })
});

const TileType = new GraphQLObjectType({
    name: 'Tile',
    fields: () => ({
        id: { type: GraphQLID },
        tileName: { type: GraphQLString },
        tileColor: { type: GraphQLString },
        campaign: {
            type: CampaignType,
            resolve(parent, args) {
                return campaign = Campaign.findByPk(parent.campaign);
            }
        },
        xAxis: { type: GraphQLInt },
        yAxis: { type: GraphQLInt },
    })
});

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        id: { type: GraphQLID },
        tileId: { type: GraphQLID },
        characterId: { type: GraphQLID },
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        character: {
            type: CharacterType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return character = Character.findByPk(args.id);
            }
        },
        characters: {
            type: GraphQLList(CharacterType),
            resolve(parent, args) {
                return character = Character.findAll();
            }
        },
        campaign: {
            type: CampaignType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return campaign = Campaign.findByPk(args.id);
            }
        },
        campaigns: {
            type: GraphQLList(CampaignType),
            resolve(parent, args) {
                return campaign = Campaign.findAll();
            }
        },
        tiles: {
            type: GraphQLList(TileType),
            args: { campaign: { type: GraphQLID } },
            resolve(parent, args) {
                return tile = Tile.findAll({ where: { campaign: args.campaign } });
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCharacter: {
            type: CharacterType,
            args: {
                charName: { type: GraphQLNonNull(GraphQLString) },
                charClass: { type: GraphQLNonNull(GraphQLString) },
                charSpec: { type: GraphQLNonNull(GraphQLString) },
                charAttack: { type: GraphQLNonNull(GraphQLInt) },
                charHealth: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return character = Character.create({
                    charName: args.charName,
                    charClass: args.charClass,
                    charSpec: args.charSpec,
                    charAttack: args.charAttack,
                    charHealth: args.charHealth,
                });
            }
        },
        addCampaign: {
            type: CampaignType,
            args: {
                cpName: { type: GraphQLNonNull(GraphQLString) },
                cpDescription: { type: GraphQLNonNull(GraphQLString) },
                cpImage: { type: GraphQLNonNull(GraphQLString) },
                cpSize: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return campaign = Campaign.create({
                    cpName: args.cpName,
                    cpDescription: args.cpDescription,
                    cpImage: args.cpImage,
                    cpSize: args.cpSize,
                });
            }
        },
        addTile: {
            type: TileType,
            args: {
                tileName: { type: GraphQLNonNull(GraphQLString) },
                campaign: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return tile = Tile.create({
                    tileName: args.tileName,
                    campaign: args.campaign,
                });
            }
        },
        addTiles: {
            type: GraphQLList(TileType),
            args: {
                campaign: { type: GraphQLNonNull(GraphQLID) },
                size: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                let i, j, tiles = [];

                let transaction;
                try {
                    transaction = await sequelize.transaction();
                    let x, y;
                    switch (args.size) {
                        case "small": {
                            x = 2, y = 3;
                            break;
                        }
                        case "large": {
                            x = 10, y = 15;
                            break;
                        }
                        case "medium": default: {
                            x = 41, y = 21;
                            break;

                        }
                    }
                    for (j = 0; j < y; j++) {
                        for (i = 0; i < x; i++) {
                            tiles[j + i] = await Tile.create({
                                tileName: ('cp_' + args.campaign + '_tile_' + j + '_' + i),
                                campaign: args.campaign,
                                xAxis: i,
                                yAxis: j,
                                tileColor: (i === 0 || j === 0 || i === (x - 1) || j === (y - 1)) ? 'grey' : 'green'
                            },
                                {
                                    transaction
                                }
                            )
                        }
                    }
                    await transaction.commit();
                    return tiles;

                } catch (error) {
                    await transaction.rollback();
                    return error;
                }
            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})