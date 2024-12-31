import mongoose from "mongoose";
const {Schema} = mongoose

const ForumPostSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    conteudo: {
        type: String,
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    respostas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'responsesForum'
    }]
})

const ForumPost = mongoose.model('ForumPost', ForumPostSchema)
export default ForumPost