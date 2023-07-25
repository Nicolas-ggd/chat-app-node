
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

    socket.on("publicMessage", (msg) => {
        const data = msg.data;
        const roomId = msg.roomId

        io.to(roomId).emit("publicMessageReceived", data)
    });


};

module.exports = configureChatSocket;