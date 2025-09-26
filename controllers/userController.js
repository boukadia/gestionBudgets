const { User } = require("../models");
const bcrypt = require("bcrypt"); 
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    
    res.render("users", { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
};

exports.registerForm = async(req, res) => {
  res.render("register");  
};
exports.loginForm = (req, res) => {
  res.render("login");  
}
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return     res.status(400).send("Invalid email");

    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid  password");
    }
    
    
  } catch (error) {
    
  }
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect("/users/login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user: " + err.message);
  }
};
