
const { Sequelize } = require("sequelize");
require("dotenv").config({ path: __dirname + "/../.env" });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.APP_URL,
    dialect: "mysql",
    logging: false,
  }
);
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASS);

sequelize.authenticate()
  .then(() => {
    console.log(" Database connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = sequelize;