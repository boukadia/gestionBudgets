// const {express}=require('express');
const {Category}=require('../models')

exports.getCategories=async(req,res)=>{
  const categories=await Category.findAll();

    // console.log(categories);
    
    res.render("categories",{categories})
}
exports.createCategorie=async(req,res)=>{
    await Category.create(req.body)
    res.redirect("/categories")
}
exports.FormCreateCategorie=async(req,res)=>{
    res.render("createCategory")
}
exports.deleteCategory=async( req,res) =>{
    await Category.findOne({where:{id:req.params.id}})
    .then((Category)=>{
        Category.destroy()
    })
    res.redirect("/categories")
}