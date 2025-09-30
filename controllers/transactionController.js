// const { Transaction, User, Category } = require('../models');
const session = require("express-session");
const {User}=require('../models')
const {Category}=require('../models')
const {Transaction}=require('../models')
exports.getTransactions= async (req,res) =>{
  
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).send('Unauthorized');
    }
    const transactions=await Transaction.findAll({where : {userId}
    ,include:[Category]
  });
  const categories=await Category.findAll();
  res.render("transactions" ,{ transactions,categories} )

  } catch (error) {
    
  }
}
exports.createTransaction= async(req,res)=>{
 
    

  try {
 const userId=req.session.userId;
  const {montant,date,description,categoryId,type}=req.body;
    await Transaction.create(
      {
        montant,
        description,
        userId,
        categoryId,
        date,
        type

      }
    )
    res.redirect('/transactions');
  } catch (error) {
    res.status(500).send("Error creating transaction: " + error.message);
  }

}

exports.editTransaction= async(req,res)=>{
  console.log("is",req.params.id);
   
  // const transactionId = req.params.id;
}


// module.exports = transactionController;
exports.updateTransaction=async(req,res)=>{
  try {
    const transactionId = req.params.id;
    await Transaction.update(req.body,{where:{id:transactionId}
    
    })
      res.redirect('/transactions')

  } catch (error) {
    res.status(500).send("Error updating transaction: " + error.message);
  }
  
}
exports.deleteTransaction=async(req,res)=>{
  try {
    const transactionId = req.params.id;
    await Transaction.destroy({where:{id:transactionId}
    })
    res.redirect('/transactions')

  } catch (error) {
    res.status(500).send("Error deleting transaction: " + error.message);
  }
}