const{DataTypes}=require('sequelize');
const sequelize=require('../config/database');
const User=require('./User');
const Category = require('./Category');
const Budget=sequelize.define("Budget",{
  //    CategoryId:{
      
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'categories',
  //     key: 'id'
  //   },
  //   allowNull: false
  // }
    //  ,
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

// Budget.belongsTo(User, { foreignKey: "userId" });
// User.hasMany(Budget, { foreignKey: "userId" });
// Budget.belongsTo(Category, { foreignKey: "categoryId" });
// Category.hasMany(Budget, { foreignKey: "categoryId" });

module.exports = Budget;
