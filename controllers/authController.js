const session = require("express-session");
const { User } = require("../models");
// const express = require('express');
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
      return res.status(400).send("Invalid email");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }
    
    // Set session data
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userName = user.name;
       await req.session.save();

    
   
    
    res.redirect("/users/dashboard");
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user: " + error.message);
  }
}

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // res.send(name);
    const user=await User.findOne({where:{email}})
    if (!user) {
       const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.redirect("/users/login");
    } else {
      res.send('this user already existe')
    
    }
    

    

    
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user: " + err.message);
  }
};

exports.dashboard = async (req, res) => {
  if (!req.session.userId) {
    res.redirect("/users/login");
    
  } else {
    
      res.render("dashboard", {
    user: {
      name: req.session.userName,
      email: req.session.userEmail
    }
  });
  }
  

}
