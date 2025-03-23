// const { DataTypes } = require('sequelize');
const { Sequelize } = require("../config/db");
// const db = require("../config/db.js");

module.exports = (sequelize, Sequelize) => {
    const todo = sequelize.define("todo", {
        id_todo: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
        nama: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        kegiatan: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        }, {
        tableName: 'todo',
        timestamps: false
    });
  
    return todo;
  };
  