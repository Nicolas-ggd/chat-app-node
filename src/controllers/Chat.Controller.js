const Chat = require('../models/Chat');

const CreateConversation = async (req, res) => {
  const convData = req.body;
  const roomId = convData.room;

  try {
    const existConv = await Chat.find({ "room": roomId });

    let newMessages;
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

    if (existConv.length > 0) {
      const conversation = existConv[0];
      conversation.messages.push(newMessages.messages[0]);
      await conversation.save();

      return res.status(200).json(newMessages);
    } else {
      await Chat.create({
        participants: convData.participants,
        createdBy: convData.participants[0],
        room: convData.room,
        messages: [newMessages.messages[0]]
      });

      return res.status(200).json(newMessages);
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

const GetConversationMembers = async (req, res) => {
  const roomId = req.query.roomId;

  try {
    const convMembers = await Chat.findOne({ "room": roomId })
      .populate('participants', 'name')
      .exec();

    if (!convMembers) {
      return res.status(400).json({ message: "Conversation members not found" });
    }

    const recipients = {
      createdBy: convMembers.createdBy,
      participants: convMembers.participants
    };

    return res.status(200).json(recipients);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Can't get conversation members" })
  }
};

module.exports = {
  CreateConversation,
  GetUserConversation,
  GetConversationMessages,
  GetConversationMembers
};