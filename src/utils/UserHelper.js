const connectedUsers = [];
const roomData = {};
let userInRoom = [];

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

const userInRoomList = (roomId, userData) => {

    if (!roomData.hasOwnProperty(roomId)) {
        roomData[roomId] = [];
    }

    const isUserAlreadyAdded = roomData[roomId].some((user) => user.userId === userData.userId);

    if (!isUserAlreadyAdded) {
        roomData[roomId].push(userData);
    }

    return roomData
};

const roomOfUsers = () => {
    return roomData;
}

const findMembersRoom = (roomId) => {
    const roomMembers = roomOfUsers();

    if (roomMembers.hasOwnProperty(roomId)) {
        const targetRoom = roomMembers[roomId];
        userInRoom = targetRoom;
        console.log(targetRoom, 'Target Room');
    } else {
        console.log(`Room with ID ${roomId} not found.`);
    }

    return userInRoom;
};

module.exports = {
    OnlineUserList,
    RemoveUserOnlineList,
    userInRoomList,
    roomOfUsers,
    findMembersRoom
};