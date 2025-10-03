// const { Transaction, User, Category } = require('../models');
const session = require("express-session");
const { User } = require("../models");
const { Category } = require("../models");
const { Transaction } = require("../models");
const {SavingGoal}=require("../models")
const { where } = require("sequelize");
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).send("Unauthorized");
    }
    const transactions = await Transaction.findAll({
      where: { userId },
      include: [Category],
    });
    const categories = await Category.findAll();
    res.render("transactions", { transactions, categories });
  } catch (error) {}
};
exports.createTransaction = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { id: req.body.categoryId },
    });

    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }

    if (category.name === "salaire" && req.body.type === "revenu") {
      await User.update(
        { salaire: req.body.montant },
        { where: { id: userId } }
      );
      await User.increment(
        { solde: req.body.montant },
        { where: { id: userId } }
      );
    } else if (req.body.type === "revenu") {
      await User.increment(
        { solde: req.body.montant },
        { where: { id: userId } }
      );
    } else {
      const user = await User.findOne({ where: { id: userId } });
      if (user.solde < req.body.montant) {
        return res.redirect(
          `/transactions?error=solde_insuffisant&solde=${user.solde}`
        );
      }

      await User.decrement(
        { solde: req.body.montant },
        { where: { id: userId } }
      );
    }


    // =====================DEBUT: savingGOALS==========================
    if (req.body.type="saving") {
      
      const savingGoal=await SavingGoal.create({})
    }


    // ========================FIN: savingGoals========================

    const { montant, date, description, categoryId, type } = req.body;
    await Transaction.create({
      montant,
      description,
      userId,
      categoryId,
      date,
      type,
    });
    res.redirect("/transactions");
  } catch (error) {
    res.status(500).send("Error creating transaction: " + error.message);
  }
};

exports.editTransaction = async (req, res) => {
  console.log("is", req.params.id);

  // const transactionId = req.params.id;
};

// module.exports = transactionController;
exports.updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    const user = await User.findOne({ where: { id: req.session.userId } });
    if (transaction.type === "depense" || transaction.type === "saving") {
      user.update({ solde: user.solde + transaction.montant }); //travail avec const user

      await Transaction.update(req.body, { where: { id: transactionId } });
      user.update({ solde: user.solde - req.body.montant }); //travail avec const user
    } else {
      user.update({ solde: user.solde - transaction.montant }); //travail avec const user

      await Transaction.update(req.body, { where: { id: transactionId } });
      user.update({ solde: user.solde + Number(req.body.montant),salaire:req.body.montant }); //travail avec const user
    }

    res.redirect("/transactions");
  } catch (error) {
    res.status(500).send("Error updating transaction: " + error.message);
  }
};
exports.deleteTransaction = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.session.userId } });
    let solde = user.solde;
    const transactionId = req.params.id;
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    if (transaction.type === "depense" || transaction.type === "saving") {
      await User.increment(
        { solde: transaction.montant },
        { where: { id: req.session.userId } }
      ); //travail avec le model direct (solde/usserId)
      await Transaction.destroy({ where: { id: transactionId } });
      res.redirect("/transactions");
    } else {
      solde -= transaction.montant;
      await user.update({ solde }); //travail avec const user

      await Transaction.destroy({ where: { id: transactionId } });
      res.redirect("/transactions");
    }
  } catch (error) {
    res.status(500).send("Error deleting transaction: " + error.message);
  }
};
