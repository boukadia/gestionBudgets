const express=require("express");
const router=express.Router();
const categoryController=require("../controllers/categoryController")

router.get("/",categoryController.getCategories)
router.post("/create",categoryController.createCategorie)
router.get("/create",categoryController.FormCreateCategorie)
router.delete("/delete/:id",categoryController.deleteCategory)


module.exports=router
