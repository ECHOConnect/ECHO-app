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
    }
})

const forumPost = mongoose.model('ForumPost', ForumPostSchema)
export default forumPost