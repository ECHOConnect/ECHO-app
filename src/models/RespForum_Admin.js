import mongoose from "mongoose";
const {Schema} = mongoose

//Criando modelo de respostas para os fórums no banco de dados
const ResponsesForum_admin = new Schema({
    conteudo: {
        type: String,
        required: true
    },
    dataCriacao: {
        type: Date,
        default: Date.now
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
})

//Exportando o modelo
const responsesForum = mongoose.model('responsesForum', ResponsesForum_admin)
export default responsesForum