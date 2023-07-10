const connectedUsers = [];

const OnlineUserList = (user) => {
    const existingUser = connectedUsers.find((u) => u._id === user._id);

    if (!existingUser) {
        connectedUsers.push(user);
    }
    console.log(connectedUsers, 'connectedUsers')
    return connectedUsers;
};

module.exports = {
    OnlineUserList
};