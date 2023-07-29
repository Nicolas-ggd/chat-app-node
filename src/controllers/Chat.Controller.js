const Chat = require('../models/Chat');

const CreateConversation = async (req, res) => {
  const convData = req.body;
  const roomId = convData.room;
  // const messages = convData.messages;
  try {
    const existConv = await Chat.find({ "room": roomId });

    let newMessages;
    console.log(convData.isPublic, 'public')
    if (convData.isPublic) {
      newMessages = {
        room: convData.room,
        createdBy: convData.createdBy,
        messages: [{
          sender: convData.messages.sender,
          content: convData.messages.content,
          timestamp: convData.messages.timestamp,
          seen: convData.messages.seen
        }]
      }
    } else {
      newMessages = {
        room: convData.room,
        createdBy: convData.createdBy,
        messages: [{
          sender: convData.messages.sender,
          content: convData.messages.content,
          recipient: convData.messages.recipient,
          timestamp: convData.messages.timestamp,
          seen: convData.messages.seen
        }]
      };
    }

    console.log(newMessages, 'newMessages')

    if (existConv.length > 0) {
      const conversation = existConv[0];
      conversation.messages.push(newMessages.messages[0]);
      await conversation.save();

      console.log(newMessages, 'conversation')
      return res.status(200).json(newMessages);
    } else {
      const newConv = await Chat.create({
        participants: convData.participants,
        createdBy: convData.participants[0],
        messages: [newMessages.messages[0]]
      });

      return res.status(200).json(newConv);
    }

  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Can't create conversation" })
  }
};

const GetConversationMessages = async (req, res) => {
  const roomId = req.query.roomId;

  try {
    const convMessages = await Chat.findOne({ "room": roomId })
      .populate('createdBy', 'name')
      .populate('messages.sender', 'name')
      .populate('messages.recipient', 'name')
      .exec()

    return res.status(200).json(convMessages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Can't get conversation messages" });
  }
};

const GetUserConversation = async (req, res) => {
  const userId = req.query.userId;

  try {
    const userConv = await Chat.find({ "participants": userId });

    res.status(200).json(userConv);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Can't get user conversation" })
  }
};

module.exports = {
  CreateConversation,
  GetUserConversation,
  GetConversationMessages
  // GetPublicConversation,
  // GetUserAllConversation
};