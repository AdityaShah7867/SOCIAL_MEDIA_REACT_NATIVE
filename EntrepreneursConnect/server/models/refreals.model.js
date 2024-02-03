const mongoose = require('mongoose');
const { Schema } = mongoose;

const referralSchema = new Schema(
    {
        referringUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        referredByUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected'],
            default: 'Pending',
        },

    },
    { timestamps: true }
);

const Referral = mongoose.model('Referral', referralSchema);

module.exports = { Referral };
