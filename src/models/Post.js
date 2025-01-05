import mongoose, { mongo } from "mongoose"
import Comentario from "./Comments.js"
const {Schema} = mongoose

const Postschema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
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
    }],
    comentarios: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comentario'
    }]
})

const Post = mongoose.model('Post', Postschema)
export default Post