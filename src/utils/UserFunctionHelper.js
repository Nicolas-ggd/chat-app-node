const Chat = require('../models/Chat');

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

module.exports = {
    userInRoom
};