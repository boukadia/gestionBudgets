const {Budget}=require('../models')
const {Category}=require('../models')

exports.getBudget=async(req,res)=>{
    const userId = req.session.userId;
   
    await Budget.findAll({where:{userId}, include:[Category]}).then((budgets)=>{
        res.render('budgets', {budgets})
    })

//     const budgets=await Budget.findAll({
//     include:[Category]
//   });
  

    // await Budget.findAll().then((budgets)=>{
    //     res.send(budgets)
    // })
    // await Budget.findAll({include:[Category]}).then((budgets)=>{
    //     res.render('budgets',{budgets})
    // })
   
    
}
exports.createBudget=async(req,res)=>{
    const userId = req.session.userId;

    const {categoryId,limit, month, year}=req.body
    await Budget.create({categoryId,userId,limit, month, year}).then(()=>{
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