import { Router } from 'express'
import mongoose from 'mongoose'
import forumPost from '../../models/forumAdmin.js'
const forumRouter = Router()

//Rota para o forúm 
forumRouter.get('/forumAdmin', (req, res) => {
    //Buscando mensagens no banco de dados
    forumPost.find().then((postagem) => {
        res.render('admin/forumAdmin', {postagem: postagem})
    }).catch((error) => {
        req.flash('error_msg', `Erro ao carregar mensagens ERRO: ${error}`)
    })
})

//Rota para processamento de dados do forúm
forumRouter.post('/forumAdmin', (req, res) => {
    //Pegando dados do forms do post 
    const {titulo, conteudo, dataCriacao} = req.body

    //Inserindo dados da postagem no banco de dados
    const novaPostagem = new forumPost({
        titulo: titulo,
        conteudo: conteudo,
        dataCriacao: dataCriacao
    })

    //Salvando no banco de dados
    novaPostagem.save().then(() => {
        req.flash('success_msg', 'Mensagem enviada com sucesso!')
        res.redirect('/admin/forumAdmin')
    }).catch((error) => {
        req.flash('error_msg', `Erro ao enviar mensagem ERRO: ${error}`)
        res.redirect('/admin/forumAdmin')
    })
})


export default forumRouter
