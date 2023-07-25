const connectedUsers = [];
const userInRoom = [];

const OnlineUserList = (user) => {
    const existingUser = connectedUsers.find((u) => u._id === user._id);

    if (!existingUser) {
        connectedUsers.push(user);
    }

    return connectedUsers;
};

const RemoveUserOnlineList = (socketId) => {
    const disconnectedUsers = connectedUsers.filter((user) => user.socketId === socketId);

    if (disconnectedUsers.length > 0) {
        disconnectedUsers.forEach((user) => {
            user.online = false;
        });
    }

    return connectedUsers;
};

const userInRoomList = (user) => {
    const existingUser = userInRoom.find((u) => u._id === user._id);

    if (!existingUser) {
        userInRoom.push(user)
    }

    return existingUser
};

module.exports = {
    OnlineUserList,
    RemoveUserOnlineList,
    userInRoomList
};