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
      .populate('message.sender', 'username')
      .populate('message.recipient', 'username')
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

    return res.status(200).json(userConversationMessages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Can't get conversation messages" });
  }
};


module.exports = {
    CreateChatConversation,
    GetConversationByUser
};