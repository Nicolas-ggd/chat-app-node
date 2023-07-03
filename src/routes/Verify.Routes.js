const express = require('express');
const router = express.Router();
const verificationHelper = require('../utils/VerificationHelper');

router.post('/', verificationHelper.verify);
router.post('/resendVerificationCode', verificationHelper.resendVerificationCode);

module.exports = router;