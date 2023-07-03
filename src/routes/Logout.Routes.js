const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/Logout.Controller');

router.post('/', logoutController.userLogout);

module.exports = router;