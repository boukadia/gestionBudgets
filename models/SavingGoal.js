const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");    
const SavingGoal = sequelize.define("SavingGoal", {
    title: {
        type: DataTypes.STRING,
        allowNull: false    ,
    },
    targetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }, 
    currentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,   
        defaultValue: 0,
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    } 
    ,}, {
    tableName: "savingGoals",
    timestamps: true,
});
module.exports = SavingGoal;