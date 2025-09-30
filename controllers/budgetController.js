const {Budget}=require('../models')
const {Category}=require('../models')

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
exports.formCreateBudget=async (req, res)=>{
    const categories= await Category.findAll()
    res.render('createBudget',{categories})
}   

exports.deleteBudget=async(req,res)=>{
    await Budget.destroy({where:{id:req.params.id}})
    .then(()=>{
        res.redirect('/budgets')
    })
}