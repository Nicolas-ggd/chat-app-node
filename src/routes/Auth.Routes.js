const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth.Controller');
const verificationHelper = require('../utils/VerificationHelper');

router.post("/", authController.userAuth);
router.post("/verify", verificationHelper.verify);

module.exports = router;