const express = require('express');
require('dotenv').config;
const cors = require('cors');
const { Server } = require('socket.io')
const chalk = require('chalk');
const boxen = require('boxen');
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
const { ConversationMembers, NewConversation, GetNewConv, conversationMembers, getConvMembers } = require('./src/utils/UserFunctionHelper');

const app = express();
connectDb();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.options('*', cors());
app.options(cors({
    origin: ['https://nicolas-ggd-chat.netlify.app', 'http://localhost:5173']
}));
app.use('/register', register);
app.use('/auth', userAuth);
app.use('/logout', userLogOut);
app.use('/reset-password', resetPassword);
app.use('/user', userInfo);
app.use('/chat', chat);

app.use(verifyJWT);
app.use(notFound);
app.use(errorHandler);

console.log(boxen(chalk.red.bgRed.bold("\n" + "Welcome to nicolas ggd server" + "\n"), {padding: 1, borderColor: 'red', dimBorder: true}) + "\n");


const server = app.listen(process.env.PORT, console.log(`Server running on port ${process.env.PORT}`));
const io = new Server(server, {
    cors: {
        origin: ['https://nicolas-ggd-chat.netlify.app', 'http://localhost:5173'],
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
        ConversationMembers(roomId, userData.userId)
        io.to(roomId).emit("userJoin", userData);
    });

    socket.on("new-messages", (data) => {
        io.to(data.room).emit("new-messages-received", data);
    });

    socket.on("new-conversation", async (data) => {
        await NewConversation(data);

        const newConv = await GetNewConv();
        io.to(data).emit("new-conversation-created", newConv);
    });

    socket.on("conversationMembers", async (roomId) => {

        await conversationMembers(roomId);

        const convMembers = await getConvMembers();

        io.to(roomId).emit("conversationMembersList", convMembers);
    })
});