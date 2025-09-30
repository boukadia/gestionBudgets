const {Budget}=require('../models')

exports.getBudget=async(req,res)=>{
    await Budget.findAll().then((budgets)=>{
        res.render('budgets',{budgets})
    })
   
    
}
exports.createBudget=async(req,res)=>{
    await Budget.create(req.body).then(()=>{
        res.redirect('/budgets')
    })
}
exports.formCreateBudget=(req, res)=>{
    res.render('createBudget')
}   