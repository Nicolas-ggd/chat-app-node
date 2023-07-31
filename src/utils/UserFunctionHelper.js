const Chat = require('../models/Chat');
let newConvers = [];

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

const NewConversation = async (room) => {
    try {
        const newConv = await Chat.find({ "room": room });

        console.log(newConv, 'new conv')
        if (newConv[0].messages.length > 1) {
            return null
        }
        
        newConvers.push(newConv);

        return newConvers;
    } catch (err) {
        console.log(err);
    }
};

const GetNewConv = async () => {
    return newConvers;
}

module.exports = {
    ConversationMembers,
    NewConversation,
    GetNewConv
};