const Chat = require('../models/Chat');
const ConversationMembers = async (room, userId) => {
    try {
        const convMembers = await Chat.findOne({ "room": room });

        if (!convMembers) {
            return console.log("Cannot find conversation members, fn() - ConversationMembers");
        }

        const isUserExist = convMembers.participants.includes(userId);

        if (!isUserExist) {
            await Chat.updateOne({ "room": room }, { $addToSet: { participants: userId } });
        }

    } catch (err) {
        console.log(err);
    }
};


module.exports = {
    ConversationMembers
};