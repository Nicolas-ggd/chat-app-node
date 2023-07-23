const Chat = require('../models/Chat');

const configureChatSocket = (socket) => {
    const io = socket;
    socket.on("createRoom", async (data) => {
        const roomId = data.roomId;
        const userData = data.userData;

        const linkParts = roomId.split("/");
        const room = linkParts[linkParts.length - 1];

        // const userJoin = await Chat.findByIdAndUpdate(
        //     { room: roomId },
        //     { participants: userData }
        // )

        socket.join(room);

        io.to(roomId).emit("userJoined", userData);
    });

    socket.on("publicMessage", async (msg) => {
        const data = msg;
        const roomId = msg.messages.room;
        const saveMessage = await Chat.create({
            participants: data.participants,
            messages: [
                {
                    sender: data.messages.sender,
                    recipient: data.messages.recipient,
                    room: data.messages.room,
                    content: data.messages.content
                }
            ]
        });

        if (saveMessage) {
            console.log(saveMessage)
            io.to(roomId).emit("publicMessageReceived", saveMessage);
        }
    });

};

module.exports = configureChatSocket;