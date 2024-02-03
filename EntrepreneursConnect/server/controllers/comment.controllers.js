const Comment = require('../models/comments.models')
const Post = require('../models/Product.models')
const User = require('../models/user.models')
const Like = require('../models/like.models')
const { createNotification } = require('../controllers/Notification.controllers')
const Addcomment = async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    try {
        if (!comment) {
            return res.status(400).json({ msg: "Comment is required" })
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({ msg: "Post not found" })
        }
        const author = req.user._id;
        const newComment = await Comment.create({
            postId: postId,
            commentedBy: author,
            comment: comment
        })


        await createNotification(req.user._id, post.author, 'comment', `${req.user.username} commented on your post ${comment}`);


        await post.comments.push(newComment);
        await post.save();
        await newComment.save();
        res.status(201).json({ msg: "Comment added", comment: newComment })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}


const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 }).populate('commentedBy', '_id username avatar')
        res.status(200).json({ comments: comments })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}



const getCommentsByPostID = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.find({ postId: postId }).sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ msg: "No comments found" });
        }

        const numberOfComments = comments.length;
        res.status(200).json({ comments: comments, qty: numberOfComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const deleteComment = async (req, res) => {
    const { commentID } = req.params;
    try {
        const comment = await Comment.findById(commentID);
        if (!comment) {
            return res.status(400).json({ msg: "No comment found" })
        }
        //check if the req.user is the one who creatde the comment
        if (comment.commentedBy.id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: "You are not authorized to delete this comment" })
        }

        const post = await Post.findById(comment.postId);
        if (!post) {
            return res.status(400).json({ msg: "No post found" })
        }
        post.comments.pull(req.user._id);
        await post.save();

        await Comment.findByIdAndDelete(commentID);
        res.status(200).json({ msg: "Comment deleted" })

    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }

}

const updateComment = async (req, res) => {
    const { commentID } = req.params;
    const { comment } = req.body;
    try {
        const commentt = await Comment.findById(commentID);
        if (!commentt) {
            return res.status(400).json({ msg: "No comment found" })
        }

        //check if the req.user is the one who creatde the comment
        if (commentt.commentedBy.id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: "You are not authorized to update this comment" })
        }
        const newcomment = await Comment.findByIdAndUpdate(commentID, {
            comment: comment
        });
        await commentt.save();
        res.status(200).json({ msg: "Comment updated", newcomment: newcomment })

    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}


const getCommentsByUserID = async (req, res) => {
    const userID = req.user._id;
    try {
        const comments = await Comment.find({ "commentedBy.id": userID }).sort({ createdAt: -1 });
        if (!comments) {
            return res.status(400).json({ msg: "No comments found" })
        }
        res.status(200).json({ comments: comments })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}



module.exports = {
    Addcomment,
    getCommentsByPostID,
    deleteComment,
    updateComment,
    getAllComments,
    getCommentsByUserID
}