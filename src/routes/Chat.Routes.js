const express = require('express');
const router = express.Router();
const chatController = require('../controllers/Chat.Controller');

router.post('/create-conversation', chatController.CreateChatConversation);
router.get('/get-public-conversation', chatController.GetPublicConversation);
router.get('/get-user-conversation', chatController.GetUserAllConversation);
router.get('/get-conversation', chatController.GetConversationByUser);
router.post('/mark-as-read', chatController.MarkMessageAsRead);

module.exports = router;