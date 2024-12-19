const dbConfig = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        port: dbConfig.port,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

// Authenticate and log connection status
sequelize.authenticate()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

// Initialize models
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.camioane = require('./camionModel.js')(sequelize, DataTypes);
db.agenti = require('./agentModel.js')(sequelize, DataTypes);
db.admin = require('./adminModel.js')(sequelize, DataTypes);
db.puncteDeDevamare = require('./punctDeDevamareModel.js')(sequelize, DataTypes);
db.puncteDeTrecere = require('./punctDeTrecereModel.js')(sequelize, DataTypes);
db.istoric = require('./istoricModel')(sequelize, DataTypes);
db.user = require('./userModel.js')(sequelize, DataTypes);

// Define associations

db.camioane.belongsTo(db.agenti, { foreignKey: 'id_agent', as: 'agent' });
db.camioane.belongsTo(db.puncteDeTrecere, { foreignKey: 'id_punct_de_trecere', as: 'punctDeTrecere' });
db.camioane.belongsTo(db.puncteDeDevamare, { foreignKey: 'id_punct_de_devamare', as: 'punctDeDevamare' });

db.agenti.hasMany(db.puncteDeDevamare, { foreignKey: 'id_agent' });
db.puncteDeDevamare.belongsTo(db.agenti, { foreignKey: 'id_agent' });

db.agenti.hasMany(db.puncteDeTrecere, { foreignKey: 'id_agent' });
db.puncteDeTrecere.belongsTo(db.agenti, { foreignKey: 'id_agent' });

// Sync models
// DELETE IN PRODUCTION
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

module.exports = db;
