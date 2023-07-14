const mongoose = require('mongoose');

const Chat = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        ],
        message: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                recipient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                content: {
                    type: String,
                    required: true
                },
                seen: {
                    type: Boolean,
                    default: false
                },
                readBy: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    }
                ],
                timestamps: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Chat', Chat);