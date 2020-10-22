const dbConfig =  require ('../config/connect.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host:dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    timezone: '+02:00',
    dialectOptions: {
        useUTC: true//for reading from database
    },
    pool : {
        max:dbConfig.pool.max,
        min:dbConfig.pool.min,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.hospitals = require('./models.js')(sequelize,Sequelize);
module.exports = db;