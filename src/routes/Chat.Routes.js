const express = require('express');
const router = express.Router();
const chatController = require('../controllers/Chat.Controller');

router.post('/create-conversation', chatController.CreateConversation);
router.get('/get-user-conversation', chatController.GetUserConversation);
router.get('/get-conversation-messages', chatController.GetConversationMessages);

module.exports = router;