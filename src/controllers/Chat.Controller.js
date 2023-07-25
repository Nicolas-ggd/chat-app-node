const Chat = require('../models/Chat');

// const CreatePublicChatConversation = async (req, res) => {
//   const data = req.body;

//   try {
//     const saveMessage = await Chat.create({
//       participants: data.participants,
//       messages: [
//         {
//           sender: data.messages.sender,
//           room: data.messages.room,
//           content: data.messages.content
//         }
//       ]
//     });

//     return res.status(200).json(saveMessage);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Can't send message" });
//   }
// };

const GetPublicConversation = async (req, res) => {
  const roomId = req.query.roomId;

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
  // CreatePublicChatConversation,
  GetConversationByUser,
  MarkMessageAsRead,
  GetPublicConversation
};