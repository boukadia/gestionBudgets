const{DataTypes}=require('sequelize');
const sequelize=require('../config/database');
const User=require('./User');
const Budget=sequelize.define("Budget",{
     category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  limit: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "budgets",
  timestamps: true
});

Budget.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Budget, { foreignKey: "userId" });

module.exports = Budget;
