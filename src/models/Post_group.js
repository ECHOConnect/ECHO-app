import mongoose from "mongoose"
const { Schema } = mongoose


const PostGroupschema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    attDate: {
        type: Date,
        default: Date.now
    },
    replies: [{
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        content: {type: String, required: true},
        createDate: {type: Date, default: Date.now}
    }]
})

const PostsGroups = mongoose.model('PostsGroups', PostGroupschema)
export default PostsGroups