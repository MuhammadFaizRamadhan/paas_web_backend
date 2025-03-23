const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('paas_web', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user_model.js")(db.sequelize, db.Sequelize)
db.todo = require("../models/todo_model.js")(db.sequelize, db.Sequelize)

// Initialize associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
      db[modelName].associate(db);
  }
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch((err) => {
  console.error('Unable to connect to the database:', err);
});

// db.sequelize.sync()
// .then(() => {
//     console.log("Synced db.");
// })
// .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
// });

module.exports = db;