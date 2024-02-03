const mongoose = require('mongoose');
const User = require('../models/user.models');

const subscriptionSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    plan: {
        type: String,
        enum: ["regular", "basic", "pro", "premium", ""],
        default: "regular"
    },
    status: {
        type: String,
        enum: ["active", "expired"],
        default: "active"
    },
    ttl: {
        type: Number,
        default: 2
    },

}, {
    timestamps: true
});


subscriptionSchema.index({ createdAt: 1 }, { expireAfterSeconds: '$ttl' });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

Subscription.watch().on('expire', async (doc) => {
    if (doc.status === "active") {
        doc.status = "expired";
        await doc.save();
    }
});


module.exports = Subscription;
