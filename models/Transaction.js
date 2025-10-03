const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transaction = sequelize.define("Transaction", {
  type: {
    type: DataTypes.ENUM("revenu","depense","saving"),
    allowNull: false
  },
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    },
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: { 
      model: 'categories',
      key: 'id'
    },
    allowNull: false
  }
}, {
  tableName: "transactions",
  timestamps: true
});

// Associations will be set up in index.js
module.exports = Transaction;
