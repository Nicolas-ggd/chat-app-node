const connectedUsers = [];
const roomData = {};

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

const userInRoomList = (roomId, user) => {

    // if (!roomData[roomId]) {
    //     roomData[roomId] = [];
    // }

    // const userIndex = roomData[roomId].findIndex((existingUser) => existingUser.userId === user.userId);

    // if (userIndex === -1) {
    //     roomData[roomId].push(user);
    // }


    // return roomData;
};

module.exports = {
    OnlineUserList,
    RemoveUserOnlineList,
    userInRoomList
};