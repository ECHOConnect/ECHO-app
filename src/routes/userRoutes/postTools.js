import {Router} from 'express'
import Post from '../../models/Post.js'
import Comentario from '../../models/Comments.js'
import mongoose from 'mongoose'
const routerPostTool = Router()

//Rota para editar postagem
routerPostTool.get('/editPost/:postId', (req, res) => {
    const postId = req.params.postId
    Post.findById(postId)
    .then((post) => {
        res.render('postTools/editPost', {
            post: post
        })
    })
})

//Processamento de dados da edição e salvamento
routerPostTool.post('/editPost/:postId', (req, res) => {
    const { titulo, conteudo, tags } = req.body
    const postId = req.params.postId

    Post.findByIdAndUpdate(postId, {
        titulo, 
        conteudo, 
        tags
    }, {new: true})
    .then((postUp) => {
        if(!postUp){
            req.flash('error_msg', 'Postagem não encontrada')
            return res.redirect('/user/home')
        }

        req.flash('success_msg', 'Postagem editada com sucesso')
        return res.redirect('/user/home')
    })
    .catch((error) => {
        req.flash('error_msg', 'Erro ao salvar alterações')
        return res.redirect('/user/home')
    })
     
})

//Rota para apagar postagem
routerPostTool.post('/deletePost/:postId', (req, res) => {
    const postId = req.params.postId
    const postObjectId = new mongoose.Types.ObjectId(postId);
    console.log('post de id: ', postId)
    console.log('post object de id: ', postObjectId)
    Post.findByIdAndDelete(postObjectId)
    .then((deletPost) => {
        if(!deletPost){
            req.flash('error_msg', 'Postagem não encontrada')
            return res.redirect('/user/home')
        }

        return Comentario.deleteMany({post: postObjectId})
    })
    .then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso!')
        return res.redirect('/user/home')
    })
    .catch((error) => {
        console.log('[debug-erro]: Erro: ', error)
        req.flash('error_msg', 'Erro ao tentar deletar postagem, tente novamente!')
        res.redirect('/user/home')
    })
})



export default routerPostTool