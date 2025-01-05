import express from 'express'
import Comentario from '../../models/Comments.js'
import Post from '../../models/Post.js'
const routeComments = express.Router()


routeComments.post('/home/comment', (req, res) => {
    //Pegando dados de comentário do formulário
    const {post, text} = req.body
    const author = req.user._id
    console.log('[debug]: autor:', author, post, text)

    //Criando novo comentário no banco
    const newComment = new Comentario({
        author: author,
        post: post,
        text: text 
    })
    // Salvando o comentário
    newComment.save()
    .then((comment) => {

        // Atualizando o post com o novo comentário
        Post.findById(post)
        .then((foundPost) => {
            foundPost.comentarios.push(comment._id) // Adicionando o comentário ao post
            return foundPost.save() // Salvando o post com o comentário
        })
        .then(() => {
            req.flash('success_msg', 'Comentário postado')
            res.redirect('/user/home')
        })
        .catch((error) => {
            console.log(`[debug]: Erro ao atualizar o post com comentário: ${error}`)
            req.flash('error_msg', 'Erro ao atualizar o post com o comentário')
            res.redirect('/user/home')
        })
    })
    .catch((error) => {
        console.log(`[debug]: Erro ao salvar comentário: ${error}`)
        req.flash('error_msg', 'Erro ao postar comentário')
        res.redirect('/user/home')
    })
    
})



export default routeComments 