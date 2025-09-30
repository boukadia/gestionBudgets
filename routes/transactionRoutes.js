const express=require ('express');
const router=express.Router();
const transactionController = require('../controllers/transactionController');
router.get("/", transactionController.getTransactions);
// router.get("/edit/:id", transactionController.editTransaction);
router.post("/create", transactionController.createTransaction);
router.put("/edit/:id",transactionController.updateTransaction);
router.delete("/delete/:id",transactionController.deleteTransaction)
module.exports = router;
