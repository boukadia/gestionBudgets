const session = require("express-session");
const { User } = require("../models");
const { Category } = require("../models");
const { Transaction } = require("../models");
const {SavingGoal}=require("../models");
const { where } = require("sequelize");
exports.getGoals = async (req, res) => {
    try {
        
        const userId = req.session.userId;
        
        if (!userId) {
            res.redirect("/users/login");
            return res.status(401).send("Unauthorized");
        }
        const savingGoals = await SavingGoal.findAll({
            where: { userId },
            
        });
      res.render("savingGoals",{savingGoals});
    } catch (error) {
      console.log(222);
      
    }
    
}