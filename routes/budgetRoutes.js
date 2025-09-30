const express=require ('express');
const router=express.Router();
const budgetController=require('../controllers/budgetController');
router.get("/",budgetController.getBudget);
router.get("/create", budgetController.formCreateBudget);
router.post("/create", budgetController.createBudget);
router.delete("/delete/:id",budgetController.deleteBudget)
module.exports = router;