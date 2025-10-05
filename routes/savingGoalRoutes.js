const express=require ('express');
const router=express.Router();
const savingGoalController=require("../controllers/savingGoalController");
// const { route } = require("./userRoutes");
router.get("/",savingGoalController.getGoals)
// router.post("/create",savingGoalController.createSavingGoal)
// router.put("/edit/:id",savingGoalController.updateSavingGoal)
// router.delete("/delete/:id",savingGoalController.deleteSavingGoal)
module.exports=router;
