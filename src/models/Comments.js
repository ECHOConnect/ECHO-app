import mongoose from "mongoose";
const {Schema} = mongoose

const commentsPosts = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    created: {
        type: Date,
        default: Date.now
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Comentario = mongoose.model('Comentario', commentsPosts)
export default Comentario