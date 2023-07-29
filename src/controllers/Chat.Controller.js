const Chat = require('../models/Chat');

const CreateConversation = async (req, res) => {
  const convData = req.body;
  const roomId = convData.room;

  try {
    const existConv = await Chat.find({ "room": roomId });

    let newMessages;
    newMessages = {
      sender: convData.messages.sender,
      recipient: convData.messages.recipient,
      content: convData.messages.content,
      seen: convData.messages.seen,
      timestamp: convData.messages.timestamp,
      room: convData.room
    }

    if (existConv.length > 0) {
      const conversation = existConv[0];
      conversation.messages.push(newMessages);
      await conversation.save();
      console.log(newMessages, 'conversation')
      return res.status(200).json(newMessages);
    } else {
      const newConv = await Chat.create(convData);

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