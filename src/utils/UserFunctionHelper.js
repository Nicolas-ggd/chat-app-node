const Chat = require('../models/Chat');
let newConvers = [];
let convMemberList = [];

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
    let convLength = false;
    try {
        const newConv = await Chat.findOne({ "room": room });

        if (newConv.messages.length > 1) {
            convLength = true;
        }

        if (convLength) {
            return null
        }

        newConvers = newConv;

        return newConvers;
    } catch (err) {
        console.log(err);
    }
};

const GetNewConv = async () => {
    return newConvers;
}


const conversationMembers = async (roomId) => {
    try {
        const convMembers = await Chat.findOne({ "room": roomId })
            .populate('participants', 'name')
            .exec();

        if (!convMembers) {
            return console.log("Conversation members not found");
        }

        const recipients = {
            createdBy: convMembers.createdBy,
            participants: convMembers.participants,
            isPublic: convMembers.isPublic
        };

        convMemberList = recipients;


    } catch (err) {
        console.log(err);
    }
};

const getConvMembers = async () => {
    return convMemberList;
};


module.exports = {
    ConversationMembers,
    NewConversation,
    GetNewConv,
    conversationMembers,
    getConvMembers
};