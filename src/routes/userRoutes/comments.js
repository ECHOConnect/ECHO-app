import express from 'express'
import Comentario from '../../models/Comments.js'
import Post from '../../models/Post.js'
import mongoose from 'mongoose'
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

//Página de edição de comentários
    routeComments.get('/editComment/:commentId', (req, res) => {
        const nomeuser = req.user
        const commentId = req.params.commentId

        Comentario.findById(commentId)
        .then((comment) => {
            res.render('PostCommentsTools/editComment', {
                nomeuser: nomeuser,
                comment: comment
            })
        })
    })

//Rota de salvamento de edição
    routeComments.post('/editComment/:commentId', (req, res) => {
        const commetId = req.params.commentId
        const { text } = req.body

        Comentario.findByIdAndUpdate(commetId, {
            text: text
        }, {new: true})
        .then(() => {
            req.flash('success_msg', 'Comentário editado com sucesso!')
            res.redirect('/user/home')
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
            req.flash('error_msg', 'Erro ao tentar editar comentário')
            res.redirect(req.headers.referer)
        })
    })

//Rota para deletar comentário
    routeComments.post('/deleteComment/:commentId', (req, res) => {
        const commentId = req.params.commentId

        Comentario.findByIdAndDelete(commentId)
        .then(() => {
            req.flash('success_msg', 'Comentário excluído com sucesso')
            res.redirect(req.headers.referer)
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
            req.flash('error_msg', 'Erro ao tentar deletar comentário')
            res.redirect(req.headers.referer)
        })
    })

//Rota para curtir comentários
    routeComments.post('/likeComment/:commentId', (req, res) => {
        const commentId = req.params.commentId
        const userId = req.user._id
        console.log('[debug]: id do usuário que deu like: ', userId)
        Comentario.findById(commentId)
        .populate('like', 'nameuser')
        .then((comment) => {
            //Validando a existência de comentários
            if(!comment){
                req.flash('error_msg', 'Comentário não encontrado')
                return res.redirect(req.headers.referer)
            }
            //Verificando se o usuário já deu like no comentário
            const hasLiked = comment.like.some(like => like._id.toString() === userId.toString())
            console.log('[debug]: Like de Comentário: ', comment.like)
            console.log('[debug]: Like de Comentário: ', comment)

            //Verificando se o usuário já deu like no comentário
            if(hasLiked){
                comment.like.pull(userId)
                comment.save()
                .then((quantLikes) => {
                    //Passando quantidade de likes para o cliente
                    res.json({msg: 'Like removido', likeCount: quantLikes.like.length})
                })
                .catch((error) => {
                    console.log('[debug]: Erro: ', error)
                    res.json({ msg: 'Erro ao remover like' });
                })
            }
            else{
                comment.like.push(userId)
                comment.save()
                .then((quantLikes) => {
                    res.json({msg: 'Like adicionado', likeCount: quantLikes.like.length})
                })
                .catch((error) => {
                    console.log('[debug]: Erro: ', error)
                    res.json({ msg: 'Erro ao adicionar like' });
                })
            }
        })
        .catch((error) => {
            console.log(error);
            res.json({ msg: 'Erro ao buscar o comentário' });
        })
    })

export default routeComments 