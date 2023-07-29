const Chat = require('../models/Chat');
let userConversation = [];
let convMembers = [];

const userInRoom = async (roomId, userId) => {
    try {
        const conversation = await Chat.findOne({ "messages.room": roomId });

        if (!conversation.participants.includes(userId)) {
            conversation.participants.push(userId);
            await conversation.save();
        } else {
            console.log('User already exists in the participants array.');
        }

    } catch (err) {
        console.log(err);
        throw err;
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

const conversationMembers = async (conv) => {
    // try {
    //     const conversationMembers = await Chat.find({ "messages.room": conv })
    //     .populate('participants', 'name')
    //     if (!conversationMembers) {
    //         return console.log('nothing here')
    //     }

    //     const membersOfConv = conversationMembers.map((conv) => {
    //         return conv.participants
    //     });
    //     convMembers = membersOfConv

    //     return convMembers;
    // } catch (err) {
    //     console.log(err);
    //     throw err;
    // }
};

const roomConvMembers = async () => {
    return convMembers;
}; 

module.exports = {
    userInRoom,
    newConversation,
    newUserConversation,
    conversationMembers,
    roomConvMembers
};