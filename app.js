const express = require("express");
const { sequelize } = require("./models");

const app = express();

sequelize.authenticate()
  .then(() => console.log(" DB connected!"))
  .catch(err => console.error(" DB error:", err));

sequelize.sync({ alter: true }) 
  .then(() => console.log(" All tables created/updated!"))
  .catch(err => console.error(err));

app.listen(3000, () => console.log("Server running on port 3000"));

