const Chat = require('../models/Chat');

const CreateChatConversation = async (req, res) => {
  const data = req.body.data;

  try {
    const saveMessage = await Chat.create({
      participants: data.participants,
      message: [
        {
          sender: data.message.sender,
          recipient: data.message.recipient,
          content: data.message.content
        }
      ]
    });

    return res.status(200).json(saveMessage);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't send message" });
  }
};

const GetConversationByUser = async (req, res) => {
  const userId = req.query.query;

  try {
    const conversationMessages = await Chat.find({
      participants: userId
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
    console.log(error);
    return res.status(500).json({ message: "Can't get conversation messages" });
  }
};

const ActiveConversation = async (req, res) => {
  try {
    await Chat.findOne({ _id })
  } catch (error) {
    return res.status(500).json({ message: "Can't get active conversations" });
  };
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
  ActiveConversation,
  MarkMessageAsRead
};