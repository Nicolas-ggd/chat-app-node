const configureChatSocket = (socket) => {
    const io = socket;
    socket.on("createRoom", (data) => {
        const roomId = data.roomId;
        const userData = data.userData;
        const linkParts = roomId.split("/");
        
        const room = linkParts[linkParts.length - 1];
        socket.join(room);

        io.to(roomId).emit("userJoined", userData);
    });
    
};

module.exports = configureChatSocket;