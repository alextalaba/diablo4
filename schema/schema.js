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
        async () => await Item.sync().then(
            async () => await Ability.sync({ alter: true }).then(
                async () => await Battle.sync({ alter: true }).then(
                    () => {
                        // Character.belongsTo(Tile, { foreignKey: 'tile', targetKey: 'id' });
                        // Item.belongsTo(Character, { foreignKey: 'character', targetKey: 'id' });
                    })
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
                return basics = Ability.findAll({ attributes: ['id', 'name', 'description', 'animation', 'range'], where: { hero: parent.id, category: 'basic' } });
            }
        },
        spells: {
            type: GraphQLList(AbilityType),
            resolve(parent, args) {
                return spells = Ability.findAll({ attributes: ['id', 'name', 'description', 'animation', 'range'], where: { hero: parent.id, category: 'spell' } });
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
})

const BattleType = new GraphQLObjectType({
    name: 'Battle',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        heroId: { type: GraphQLID },
        enemyId: { type: GraphQLID },
        heroPosition: { type: GraphQLInt },
        enemyPosition: { type: GraphQLInt },
        outcome: { type: GraphQLString },
        background: { type: GraphQLString },
    })
})

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
        range: { type: GraphQLInt },
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
        battle: {
            type: BattleType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return battle = Battle.findByPk(args.id);
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
        addBattle: {
            type: BattleType,
            args: {
                heroId: { type: GraphQLNonNull(GraphQLID) },
                enemyId: { type: GraphQLNonNull(GraphQLID) },
                background: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                return battle = Battle.create({
                    name: 'random name',
                    heroId: args.heroId,
                    enemyId: args.enemyId,
                    heroPosition: 3,
                    enemyPosition: 10,
                    background: args.background,
                })
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
                range: { type: GraphQLInt },
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
                    range: args.range,
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