const express = require("express");
const session = require('express-session');

const { sequelize } = require("./models");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes=require("./routes/categoryRoutes")
const methodOverride=require('method-override')


const app = express();
app.use(methodOverride('_method'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret-key', // Always use env variable in production
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use("/users", userRoutes);
app.use('/transactions', transactionRoutes);
app.use('/budgets', budgetRoutes);
app.use('/categories',categoryRoutes);


sequelize.authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch(err => console.error("DB error:", err));

sequelize.sync() 
  .then(() => console.log("All tables created/updated!"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.listen(3000, () => console.log("Server running on port 3000"));

