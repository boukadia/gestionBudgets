const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.getUsers);

router.get("/register", authController.registerForm);
router.post("/register", authController.registerUser);

router.get("/login", authController.loginForm);
router.post("/login", authController.loginUser);
router.get("/dashboard", authController.dashboard);
router.get("/profile", authController.profile);
router.post("/profile/update", authController.updateProfile);
router.post("/password/update", authController.updatePassword);
router.post("/email/update", authController.updateEmail);
router.get("/logout",authController.logOut)

module.exports = router;