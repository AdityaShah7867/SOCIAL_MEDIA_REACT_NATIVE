
const mongoose = require('mongoose')


const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: String,
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification;