const Chat = require('../models/Chat');

const configureChatSocket = (socket) => {
    const io = socket;
    socket.on("joinRoom", async (data) => {
        const roomId = data.roomId;
        const userData = data.userData;

        const linkParts = roomId.split("/");
        const room = linkParts[linkParts.length - 1];

        socket.join(room);

        io.in(roomId).emit("userJoined", userData);
    });

    socket.on("publicMessage", async (msg) => {
        const data = msg;
        const roomId = msg.messages.room;

        console.log(roomId, 'room id');

        const checkConversation = await Chat.find({ "messages.room": roomId });
        console.log(checkConversation?.length, 'checkcheck');

        const newMessage = {
            sender: data.messages.sender,
            room: data.messages.room,
            content: data.messages.content
        };

        if (checkConversation?.length > 0) {

            const conversationToUpdate = checkConversation[0];
            conversationToUpdate.messages.push(newMessage);
            console.log(conversationToUpdate)
            await conversationToUpdate.save();

            socket.emit("publicMessageReceived", conversationToUpdate);
        } else {
            const saveMessage = await Chat.create({
                participants: data.participants,
                messages: [newMessage]
            });

            console.log(saveMessage, 'saveMessage22222');
            io.in(roomId).emit("publicMessageReceived", saveMessage);
        }
    });


};

module.exports = configureChatSocket;