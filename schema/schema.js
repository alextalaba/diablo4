const graphql = require('graphql');


const Character = require('../models/character');
const Campaign = require('../models/campaign');
const Tile = require('../models/tile');
const Item = require('../models/item');
const Ability = require('../models/ability');
const Battle = require('../models/battle');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLNonNull, GraphQLList } = graphql;
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize('heroku_bc9866ebbed68b0', 'bc61100f7ed2c3', '13d1bd82', {
    host: 'eu-cdbr-west-02.cleardb.net',
    dialect: 'mysql'
});


Character.sync().then(
    async () => await Campaign.sync().then(
        async () => await Tile.sync().then(
            async () => await Item.sync().then(
                async () => await Ability.sync().then(
                    async () => await Battle.sync().then(

                        () => {
                            // Tile.belongsTo(Campaign, { foreignKey: 'campaign', targetKey: 'id' });
                            // Character.belongsTo(Tile, { foreignKey: 'tile', targetKey: 'id' });
                            // Item.belongsTo(Character, { foreignKey: 'character', targetKey: 'id' });
                        })
                )
            )
        )
    )
)

// Character.sync({ alter: true }).then(
//     async () => await Campaign.sync({ alter: true }).then(
//         async () => await Tile.sync({ alter: true }).then(
//             async () => await Character.sync({ alter: true }).then(
//                 async () => await Item.sync({ alter: true }))
//         )
//     )
// )

const CharacterType = new GraphQLObjectType({
    name: 'Character',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        role: { type: GraphQLString },
        cls: { type: GraphQLString },
        spec: { type: GraphQLString },
        attack: { type: GraphQLInt },
        health: { type: GraphQLInt },
        currentHealth: { type: GraphQLInt },
        imgIdle: { type: GraphQLString },
        imgDead: { type: GraphQLString },
        tile: { type: GraphQLID },
        basics: {
            type: GraphQLList(AbilityType),
            resolve(parent, args) {
                return basics = Ability.findAll({ attributes: ['id', 'name', 'description', 'animation'], where: { hero: parent.id, category: 'basic' } });
            }
        },
        spells: {
            type: GraphQLList(AbilityType),
            resolve(parent, args) {
                return spells = Ability.findAll({ attributes: ['id', 'name', 'description', 'animation'], where: { hero: parent.id, category: 'spell' } });
            }
        }
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
        character: { type: GraphQLID },
    })
});

const AbilityType = new GraphQLObjectType({
    name: 'Ability',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        hero: {
            type: CharacterType,
            resolve(parent, args) {
                return hero = Character.findByPk(parent.hero);
            }
        },
        target: { type: GraphQLString },
        category: { type: GraphQLString },
        modifier1: { type: GraphQLString },
        modifier2: { type: GraphQLString },
        cost: { type: GraphQLFloat },
        healthChange: { type: GraphQLFloat },
        manaChange: { type: GraphQLFloat },
        attackChange: { type: GraphQLFloat },
        animation: { type: GraphQLString },

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
        abilities: {
            type: GraphQLList(AbilityType),
            resolve(parent, args) {
                return ability = Ability.findAll();
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
                return tile = Tile.findAll({
                    attributes: ["id", "tileColor"],
                    where: { campaign: args.campaign }
                });
            }
        },
        tilesAtXY: {
            type: GraphQLList(TileType),
            args: {
                xAxis: { type: GraphQLInt },
                yAxis: { type: GraphQLInt },
                campaign: { type: GraphQLID }
            },
            resolve(parent, args) {
                return tile = Tile.findAll({
                    attributes: ["id", "tileColor", "xAxis", "yAxis"],
                    where: {
                        campaign: args.campaign,
                        xAxis:
                            [
                                args.xAxis - 4,
                                args.xAxis - 3,
                                args.xAxis - 2,
                                args.xAxis - 1,
                                args.xAxis,
                                args.xAxis + 1,
                                args.xAxis + 2,
                                args.xAxis + 3,
                                args.xAxis + 4
                            ],
                        yAxis:
                            [
                                args.yAxis - 3,
                                args.yAxis - 2,
                                args.yAxis - 1,
                                args.yAxis,
                                args.yAxis + 1,
                                args.yAxis + 2,
                                args.yAxis + 3,
                            ],
                    }
                });
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
                name: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLNonNull(GraphQLString) },
                cls: { type: GraphQLNonNull(GraphQLString) },
                spec: { type: GraphQLNonNull(GraphQLString) },
                attack: { type: GraphQLNonNull(GraphQLInt) },
                health: { type: GraphQLNonNull(GraphQLInt) },
                imgIdle: { type: GraphQLString },
                imgDead: { type: GraphQLString }
            },
            resolve(parent, args) {
                return character = Character.create({
                    name: args.name,
                    role: args.role,
                    cls: args.cls,
                    spec: args.spec,
                    attack: args.attack,
                    health: args.health,
                    currentHealth: args.health,
                    imgIdle: args.imgIdle,
                    imgDead: args.imgDead
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
        },
        changeTileColor: {
            type: TileType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                tileColor: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return tile = Tile.update({ tileColor: args.tileColor }, { where: { id: args.id } })
            }
        },

        //ABILITIES
        addAbility: {
            type: AbilityType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                hero: { type: GraphQLNonNull(GraphQLID) },
                target: { type: GraphQLNonNull(GraphQLString) },
                category: { type: GraphQLNonNull(GraphQLString) },
                cost: { type: GraphQLFloat },
                modifier1: { type: GraphQLString },
                modifier2: { type: GraphQLString },
                healthChange: { type: GraphQLFloat },
                attackChange: { type: GraphQLFloat },
                manaChange: { type: GraphQLFloat },
                animation: { type: GraphQLString },
            },
            resolve(parent, args) {
                return ability = Ability.create({
                    name: args.name,
                    description: args.description,
                    hero: args.hero,
                    target: args.target,
                    category: args.category,
                    cost: args.cost,
                    modifier1: args.modifier1,
                    modifier2: args.modifier2,
                    healthChange: args.healthChange,
                    attackChange: args.attackChange,
                    manaChange: args.manaChange,
                    animation: args.animation,
                });
            }
        },

        removeAbility: {
            type: GraphQLBoolean,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Ability.destroy({
                    where: {
                        id: args.id
                    }
                });
            }
        },

        castAbility: {
            type: GraphQLBoolean,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
                targetId: { type: GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                let ability = await Ability.findByPk(args.id).then(async (ability) => {
                    let hero = await Character.findByPk(ability.hero).then(async (hero) => {
                        if (ability.target === 'enemy') {
                            let enemy = await Character.findByPk(args.targetId).then(async (enemy) => {
                                if (ability.modifier1 === 'attack') {
                                    await Character.update({
                                        currentHealth: (enemy.currentHealth + hero.attack * ability.healthChange)
                                    }, { where: { id: args.targetId } }).then(() => { return true })
                                }
                            });

                        }
                        if (ability.target === 'self') {
                            let enemy = await Character.findByPk(args.targetId).then(async (enemy) => {
                                if (ability.modifier1 === 'health') {
                                    await Character.update({
                                        currentHealth: (hero.currentHealth + hero.health * ability.healthChange) > hero.health ?
                                            hero.health : (hero.currentHealth + hero.health * ability.healthChange)
                                    }, { where: { id: hero.id } }).then(() => { return true })
                                }
                            });

                        }
                    });;
                })


            }
        }
    }
});



module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})