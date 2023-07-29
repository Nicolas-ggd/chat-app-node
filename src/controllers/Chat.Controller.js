const Chat = require('../models/Chat');

const CreateConversation = async (req, res) => {
  const convData = req.body;
  const roomId = convData.room;

  try {
    const existConv = await Chat.findOne({ "room": roomId });

    let newMessages;
    if (convData.isPublic) {
      newMessages = {
        sender: convData.createdBy,
        content: convData.messages.content,
        timestamp: convData.messages.timestamp,
        seen: convData.messages.seen
      }
    } else {
      newMessages = {
        sender: convData.createdBy,
        recipient: convData.messages.recipient,
        content: convData.messages.content,
        timestamp: convData.messages.timestamp,
        seen: convData.messages.seen
      };
    }

    if (existConv) {
      existConv.messages.push(newMessages);
      await existConv.save();

      return res.status(200).json(newMessages);
    } else {
      const newConv = await Chat.create({
        room: convData.room,
        participants: convData.participants,
        createdBy: convData.participants[0],
        messages: [newMessages]
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