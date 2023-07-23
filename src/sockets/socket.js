const socketio = require('socket.io');
const { OnlineUserList, RemoveUserOnlineList } = require('../utils/UserHelper');

const configureSocket = (server) => {
    const io = socketio(server);

    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on("userConnected", (data) => {
            data.online = true;
            data.socketId = socket.id;
            const users = OnlineUserList(data);

            io.emit("connectedUsers", users);
        });

        require('../sockets/chatSocket')(socket);

        socket.on("disconnect", () => {
            const disconnectedUsers = RemoveUserOnlineList(socket.id);
            const rooms = Object.keys(socket.rooms);
            rooms.forEach((room) => {
                socket.leave(room);
            });
            if (disconnectedUsers.length > 0) {
                io.emit("userDisconnected", disconnectedUsers);
            }
        });
    });

    return io;
};

module.exports = configureSocket;