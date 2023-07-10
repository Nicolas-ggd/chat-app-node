const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.Controller');

router.get('/get-all-user', userController.GetAllUser);
router.get('/search-user', userController.SearchUser);
router.get('/get-user', userController.GetOneUser);

module.exports = router;