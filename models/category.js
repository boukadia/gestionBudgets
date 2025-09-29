const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');
const Category=sequelize.define('Category',{
    name: DataTypes.STRING,
    description: DataTypes.TEXT
},{ tableName: 'categories',
timestamps: true

});
module.exports=Category