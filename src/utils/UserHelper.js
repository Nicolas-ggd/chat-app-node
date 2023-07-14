const connectedUsers = [];

const OnlineUserList = (user) => {
    const existingUser = connectedUsers.find((u) => u._id === user._id);

    if (!existingUser) {
        connectedUsers.push(user);
    }
    console.log(connectedUsers, 'connectedUsers')
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

module.exports = {
    OnlineUserList,
    RemoveUserOnlineList
};