const mongoose = require('mongoose');
const User = require('../models/user.models')

// Define the Group schema
const groupSchema = new mongoose.Schema({
    groupname: {
        type: String,
        required: true,
        unique: true,
    },
    avatar: {
        type: {
            url: String,
            public_id: String
        },
        default: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Noun_Project_Community_icon_986471.svg/1200px-Noun_Project_Community_icon_986471.svg.png",
            public_id: "GroupAvatar_qq7x5o"
        }
    },
    description: {
        type: String,
        required: true,
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [

        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    discussions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Discussion',
        },
    ],
});


// Group disscusion model
const discussionSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Group model
const Group = mongoose.model('Group', groupSchema);

const GroupDiscussion = mongoose.model('Discussion', discussionSchema);


// const newValues = {
//     TotalReferral: ""
// }


// User.updateMany({}, { $set: newValues }).then(() => {
//     console.log("done")
// }).catch((err) => {
//     console.log(err)
// })




module.exports = {
    Group,
    GroupDiscussion
};
