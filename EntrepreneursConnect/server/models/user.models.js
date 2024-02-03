const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Product } = require('./Product.models')
const Subscription = require('../models/subscription.models')



const userSchema = new Schema(
    {
        avatar: {
            type: {
                url: String,

            },
            default: {
                url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                public_id: "avatars/default-avatar"
            }
        }
        ,
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long'],
            lowercase: true,
            index: true,
        },
        bio: {
            type: String,
            default: "No bio..."
        },
        points: {
            type: Number,
            default: 0
        },
        level: {
            type: String,
            default: 'New User'
        },
        badges: [{ type: String }],
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 8 characters long'],
        },
        subscription: {
            type: String,
            enum: ["basic", "pro", "premium"],
        },
        followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        productsShowcased: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        discussionsParticipated: [{ type: Schema.Types.ObjectId, ref: 'Discussion' }],
        referredBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        referredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        CompanyName: {
            type: String,
            default: ""
        },
        referral: {
            type: String,
            default: ""
        },
        TotalReferral: {
            type: Number,
            default: 0
        },
        Place: {
            type: String,
            default: ""
        },
        InstagramLink: {
            type: String,
            default: ""
        },
        LinkedInLink: {
            type: String,
            default: ""
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        }

    },
    { timestamps: true }
);



userSchema.pre('remove', async function (next) {
    const user = this;

    // Assuming you have a separate schema for posts named "Post"
    await Post.deleteMany({ user: user._id });

    next();
});





const User = mongoose.model("User", userSchema);
module.exports = User;


// const newValues = {
//     TotalReferral: ""
// }


// User.updateMany({}, { $set: newValues }).then(() => {
//     console.log("done")
// }).catch((err) => {
//     console.log(err)
// })

