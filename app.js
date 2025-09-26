const express = require("express");
const { sequelize } = require("./models");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/users", userRoutes);

sequelize.authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.error("DB error:", err));

sequelize.sync({ alter: true }) 
  .then(() => console.log("All tables created/updated!"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.listen(3000, () => console.log("Server running on port 3000"));

