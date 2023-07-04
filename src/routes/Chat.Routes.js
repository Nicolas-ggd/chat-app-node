const express = require('express');
const router = express.Router();
const chatController = require('../controllers/Chat.Controller');

router.post('/create-conversation', chatController.CreateChatConversation);
router.get('/get-conversation', chatController.GetConversationByUser);

module.exports = router;