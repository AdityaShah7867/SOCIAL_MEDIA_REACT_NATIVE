const mongoose = require('mongoose');
const { Schema } = mongoose;

const discussionSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Discussion title is required'],
        },
        content: {
            type: String,
            required: [true, 'Discussion content is required'],
        },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        comments: [
            {
                author: { type: Schema.Types.ObjectId, ref: 'User' },
                content: String,

            },
        ],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;


