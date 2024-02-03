
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = require('./Product.models')
const User = require('./user.models')



const CommentSchema = new Schema(
    {
        postId: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            default: null,
        },
        comment: {
            type: String,
            required: true,
            index: true
        },
        commentedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    },
    { timestamps: true }
);


const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
