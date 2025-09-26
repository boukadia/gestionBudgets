const sequelize = require("../config/database");
const User = require("./User");
const Transaction = require("./Transaction");
const Budget = require("./Budget");
const SavingGoal = require("./SavingGoal");

User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Budget, { foreignKey: 'userId' });
Budget.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(SavingGoal, { foreignKey: 'userId' });
SavingGoal.belongsTo(User, { foreignKey: 'userId' });

module.exports = { 
    sequelize,
    User,
    Transaction,
    Budget,
    SavingGoal
};
