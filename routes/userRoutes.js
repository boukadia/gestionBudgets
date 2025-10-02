const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getUsers);

router.get("/register", authController.registerForm);
router.post("/register", authController.registerUser);

router.get("/login", authController.loginForm);
router.post("/login", authController.loginUser);
router.get("/dashboard", authController.dashboard);
router.get("/logout",authController.logOut)

module.exports = router;