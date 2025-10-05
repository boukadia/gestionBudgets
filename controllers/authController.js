const session = require("express-session");
const { User, SavingGoal } = require("../models");
const { Transaction } = require("../models");
const { Category } = require("../models");
const { Budget } = require("../models");
// const express = require('express');
const bcrypt = require("bcrypt");
const { where } = require("sequelize");
exports.getUsers = async (req, res) => {
  try {
    if (!req.session.userId) {
      res.redirect("/users/login");
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server Error");
  }
};

exports.registerForm = async (req, res) => {
  res.render("register");
};
exports.loginForm = (req, res) => {
  res.render("login");
};
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
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // res.send(name);
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.redirect("/users/login");
    } else {
      res.send("this user already existe");
    }
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user: " + err.message);
  }
};

exports.dashboard = async (req, res) => {
  // const budgets=await Budget.findAll({where:user},{include:Category}) 
  //   res.send(budgets)
  try {
    const user = await User.findOne({ where: { id: req.session.userId } });
    const budgets=await Budget.findAll({where:{userId:req.session.userId},include:Category}) 
    const categories = await Category.findAll();
    const derniersTransactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      where: { userId: user.id },
      include: [Category],
    });
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      where: { userId: user.id },
      include: [Category],
    });
    const sumDepense = await Transaction.sum("montant", {
      where: { userId: user.id, type: "depense" },
    });
    const sumRevenu = await Transaction.sum("montant", {
      where: { userId: req.session.userId, type: "revenu" },
    });
    const savingGoals=await SavingGoal.findOne({where:{userId:user.id}})
    const currentAmount=savingGoals.currentAmount;

    // Calculate total amount for each category
    const categoryTotals = {};
    for (const category of categories) {
      const total = await Transaction.sum('montant', {
        where: { 
          userId: user.id,
          categoryId: category.id
        }
      }) || 0;
      categoryTotals[category.id] = total;
    }

    if (!req.session.userId) {
      res.redirect("/users/login");
    } else {
      res.render("dashboard", {
        user: {
          name: req.session.userName,
          email: req.session.userEmail,
          solde: user.solde,
        },
        categories: categories,
        transactions: transactions,
        derniersTransactions: derniersTransactions,
        sumDepense: sumDepense,
        sumRevenu: sumRevenu,
        currentAmount:currentAmount,
        budgets:budgets,
        categoryTotals: categoryTotals
      });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user: " + error.message);
  }
};

exports.logOut = async (req, res) => {
  await req.session.destroy();
  res.redirect("/users/login");
};

exports.profile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/users/login");
    }
    
    const user = await User.findOne({ where: { id: req.session.userId } });
    
    const derniersTransactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
      where: { userId: user.id },
      include: [Category],
    });
    
    const transactionsCount = await Transaction.count({
      where: { userId: user.id }
    });
    
    const savingGoalsCount = await SavingGoal.count({
      where: { userId: user.id }
    });
    
    const sumDepense = await Transaction.sum("montant", {
      where: { userId: user.id, type: "depense" },
    });
    
    const sumRevenu = await Transaction.sum("montant", {
      where: { userId: req.session.userId, type: "revenu" },
    });

    res.render("profile", {
      user: {
        name: user.name,
        email: user.email,
        solde: user.solde,
      },
      derniersTransactions: derniersTransactions,
      transactionsCount: transactionsCount,
      savingGoalsCount: savingGoalsCount,
      sumDepense: sumDepense,
      sumRevenu: sumRevenu
    });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).send("Error loading profile: " + error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/users/login");
    }

    const { name, email } = req.body;
    
    await User.update(
      { name, email },
      { where: { id: req.session.userId } }
    );
    
    // Update session data
    req.session.userName = name;
    req.session.userEmail = email;
    await req.session.save();
    
    res.redirect("/users/profile");
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("Error updating profile: " + error.message);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/users/login");
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Verify if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).send("Les nouveaux mots de passe ne correspondent pas");
    }
    
    // Get user and verify current password
    const user = await User.findOne({ where: { id: req.session.userId } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).send("Mot de passe actuel incorrect");
    }
    
    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: req.session.userId } }
    );
    
    res.redirect("/users/profile");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Error updating password: " + error.message);
  }
};

exports.updateEmail = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/users/login");
    }

    const { newEmail, password } = req.body;
    
    // Get user and verify password
    const user = await User.findOne({ where: { id: req.session.userId } });
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).send("Mot de passe incorrect");
    }
    
    // Check if email is already used
    const existingUser = await User.findOne({ where: { email: newEmail } });
    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).send("Cet email est déjà utilisé");
    }
    
    // Update email
    await User.update(
      { email: newEmail },
      { where: { id: req.session.userId } }
    );
    
    // Update session data
    req.session.userEmail = newEmail;
    await req.session.save();
    
    res.redirect("/users/profile");
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).send("Error updating email: " + error.message);
  }
};
