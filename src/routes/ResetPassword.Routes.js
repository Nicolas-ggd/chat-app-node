const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/ResetPassword.Controller');

router.post("/", resetPasswordController.resetUserPassword);
router.post("/user-token", resetPasswordController.findUserWithToken);

module.exports = router;