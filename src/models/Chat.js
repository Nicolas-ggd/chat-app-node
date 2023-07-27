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
        isPublic: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                recipient: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: false,
                },
                room: {
                    type: String,
                    required: false,
                },
                content: {
                    type: String,
                    required: true
                },
                seen: {
                    type: Boolean,
                    default: false
                },
                timestamp: {
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