const Chat = require('../models/Chat');

const CreateChatConversation = async (req, res) => {
  const chatData = req.body;
  const roomId = chatData.messages.room;

  try {
    const existConversation = await Chat.find({ "messages.room": roomId });

    let newMessage;
    if (chatData.isPublic) {
      newMessage = {
        sender: chatData.messages.sender,
        content: chatData.messages.content,
        room: chatData.messages.room,
        createdBy: chatData.createdBy,
      };
    } else {
      newMessage = {
        sender: chatData.messages.sender,
        content: chatData.messages.content,
        room: chatData.messages.room,
        createdBy: chatData.createdBy,
        recipient: chatData.messages.recipient,
      };
    }

    if (existConversation.length > 0) {
      const conversation = existConversation[0];
      conversation.messages.push(newMessage);
      await conversation.save();

      return res.status(200).json(newMessage);
    } else {
      await Chat.create({
        participants: chatData.participants,
        createdBy: chatData.participants[0],
        messages: [newMessage]
      });

      return res.status(200).json(newMessage);
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't create chat conversation, try again" });
  }
};

const GetPublicConversation = async (req, res) => {
  const roomId = req.query.roomId;

  try {
    const conversation = await Chat.find(
      { 'messages.room': roomId }
    )
      .populate('messages.sender', 'name')
      .populate('participants', 'name')

    return res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't get conversation" });
  }
};

const GetUserAllConversation = async (req, res) => {
  const userId = req.query.userId;

  try {
    const userConversations = await Chat.find({ "participants": userId });

    const selectedRooms = userConversations.map(conversation => {
      return conversation.messages[0].room;
    });

    return res.status(200).json(selectedRooms);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't get user conversation" });
  }
};

const GetConversationByUser = async (req, res) => {
  const userId = req.query.userId;
  const receiver = req.query.receiver;

  try {
    const conversationMessages = await Chat.find({
      $and: [
        { 'participants': userId },
        { 'participants': receiver },
      ]
    })
      .populate('message.sender', 'name')
      .populate('message.recipient', 'name')
      .exec();

    const userConversationMessages = conversationMessages.map(conversation => {
      const filteredMessages = conversation.message.filter(message => {
        return (
          message.sender._id.toString() === userId ||
          message.recipient._id.toString() === userId
        );
      });
      return { ...conversation.toObject(), message: filteredMessages };
    });

    if (userConversationMessages.length === 0) {
      return res.status(404).json({ message: "User conversation not found" });
    }
    return res.status(200).json(userConversationMessages);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Can't get conversation messages" });
  }
};

const MarkMessageAsRead = async (req, res) => {
  const { messageId } = req.body;

  try {
    const messageAsRead = await Chat.findOneAndUpdate(
      { 'message._id': messageId },
      { $set: { 'message.$.seen': true } },
      { new: true }
    );

    return res.status(200).json(messageAsRead);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't mark message as a read" });
  }
};

module.exports = {
  CreateChatConversation,
  GetConversationByUser,
  MarkMessageAsRead,
  GetPublicConversation,
  GetUserAllConversation
};