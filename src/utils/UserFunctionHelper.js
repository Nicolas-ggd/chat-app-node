const Chat = require('../models/Chat');
let userConversation = [];

const userInRoom = async (roomId, userId) => {
    try {
        const conversation = await Chat.findOne({ "messages.room": roomId })

        if (!conversation.participants.includes(userId)) {
            conversation.participants.push(userId);
            await conversation.save();
        }
    } catch (err) {
        console.log(err);
    }
};

const newConversation = async (userId) => {
    try {
        const conversation = await Chat.find({ "messages.recipient": userId })

        const findConv = conversation.map((conv) => {
            return conv.messages[0].room
        });
        userConversation = findConv;
        return userConversation;
    } catch (err) {
        console.log(err)
        throw err;
    }
};

const newUserConversation = async () => {
    return userConversation;
};

module.exports = {
    userInRoom,
    newConversation,
    newUserConversation
};