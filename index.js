const express = require('express');
const dotenv = require('dotenv').config;
const cors = require('cors');
const { Server } = require('socket.io')
const connectDb = require('./src/configs/Database');
const { notFound, errorHandler } = require('./src/middlewares/ErrorMiddleware');
const cookieParser = require('cookie-parser');
const corsOptions = require('./src/configs/CorsOption');
const credentials = require('./src/middlewares/Credentials');
const verifyJWT = require('./src/middlewares/VerifyJwt');
const register = require('./src/routes/Register.Routes');
const userAuth = require('./src/routes/Auth.Routes');
const userLogOut = require('./src/routes/Logout.Routes');
const resetPassword = require('./src/routes/ResetPassword.Routes');
const userInfo = require('./src/routes/User.Routes');
const chat = require('./src/routes/Chat.Routes');
const { OnlineUserList, RemoveUserOnlineList, userInRoomList, findMembersRoom } = require('./src/utils/UserHelper');
const { userInRoom, newConversation, newUserConversation } = require('./src/utils/UserFunctionHelper');

const app = express();
connectDb();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.options('*', cors())
app.use('/register', register);
app.use('/auth', userAuth);
app.use('/logout', userLogOut);
app.use('/reset-password', resetPassword);
app.use('/user', userInfo);
app.use('/chat', chat);

app.use(verifyJWT);
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`));
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
})

io.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("userConnected", (data) => {
        data.online = true;
        data.socketId = socket.id;
        const users = OnlineUserList(data);

        io.emit("connectedUsers", users);
    });

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

    socket.on("joinRoom", ({ roomId, userData }) => {
        socket.join(roomId);

        userInRoomList(roomId, userData);
        io.to(roomId).emit("userJoin", userData);
    });

    socket.on("new-message", async (data) => {
        const roomId = data.room;
        const userId = data.sender;
        userInRoom(roomId, userId);

        await newConversation(data.recipient);
        let userConversation = await newUserConversation()
        
        io.to(data.recipient).emit("new-conversation", userConversation);
        io.to(roomId).emit("new-message-received", data);
    });

    socket.on("group-members", (data) => {
        const roomMembers = findMembersRoom(data);

        io.to(data).emit("group-member-list", roomMembers);
    });
});