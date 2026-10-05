const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,          
    dialect: dbConfig.dialect,    

    dialectOptions: {
    ssl: {
        require: true,             
        rejectUnauthorized: false
        }
    },

    pool: {
        max: dbConfig.pool.max,   
        min: dbConfig.pool.min,     
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle     
    }
});

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

///////////////////////////////////////////////////

//db.pruebaAPI = require("./pruebaAPI.model.js")(sequelize, Sequelize);

db.usuariosAPI = require("./usuariosAPI.model.js")(sequelize, Sequelize);

db.artistasAPI = require("./artistasAPI.model.js")(sequelize, Sequelize);

db.conciertosAPI = require("./conciertosAPI.model.js")(sequelize, Sequelize);

db.inventario_boletosAPI = require("./inventario_boletosAPI.model.js")(sequelize, Sequelize);

db.detalle_ventasAPI = require("./detalle_ventasAPI.model.js")(sequelize, Sequelize);

db.ventas_reporteAPI = require("./ventas_reporteAPI.model.js")(sequelize, Sequelize);

db.clientes_registradosAPI = require("./clientes_registradosAPI.model.js")(sequelize, Sequelize);

module.exports = db;