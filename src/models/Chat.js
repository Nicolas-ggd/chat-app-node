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
                    required: false
                },
                content: {
                    type: String,
                    required: true
                },
                private: {
                    type: Boolean,
                    required: true
                },
                seen: {
                    type: Boolean,
                    default: false
                },
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