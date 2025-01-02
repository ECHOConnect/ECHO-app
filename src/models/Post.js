import mongoose from "mongoose"
const {Schema} = mongoose

const Postschema = new Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    titulo: {
        type: String,
    },
    conteudo: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
})

const Post = mongoose.model('Post', Postschema)
export default Post