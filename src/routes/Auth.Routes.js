const express = require('express');
const router = express.Router();
const authController = require('../controllers/Auth.Controller');

router.post("/", authController.userAuth);

module.exports = router;