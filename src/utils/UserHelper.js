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
    const index = connectedUsers.findIndex((user) => user.socketId === socketId);

    if (index !== -1) {
        const disconnectedUser = connectedUsers[index];
        disconnectedUser.online = false;
        connectedUsers.splice(index, 1);
        return disconnectedUser;
    }

    return null;

};

module.exports = {
    OnlineUserList,
    RemoveUserOnlineList
};