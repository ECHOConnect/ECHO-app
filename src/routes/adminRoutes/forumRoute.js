import { Router } from 'express'
import mongoose from 'mongoose'
import forumPost from '../../models/Forum_Admin.js'
import responsesForum from '../../models/RespForum_Admin.js'
const forumRouter = Router()

//Rota para o forúm 
forumRouter.get('/forumAdmin', (req, res) => {
    //Buscando mensagens no banco de dados
    forumPost.find()
    .sort({dataCriacao: -1})
    //Buscando as postagens de forma individual
    .then((postagem) => {
        //Buscando respostas da respectiva postagem
        const postsWithResponsesPromises = postagem.map((postagem) => {
            //Retornando as respostas com base no id da postagem
            return responsesForum.find({postId: postagem._id})
            //Ordenando da resposta mais recente
            .sort({dataCriacao: - 1})
            .then((respostas) => {
                postagem.respostas = respostas
                return postagem
            })
        })
        //Quando tudo estiver pronto mandar as respostas para o arquivo dinâmico
        Promise.all(postsWithResponsesPromises)
        .then((postsWithResponses) => {
            res.render('admin/forumAdmin', {postagem: postsWithResponses, layout: 'main'})
        })
        .catch((error) => {
            console.log('erro: '+ error)
            req.flash('error_msg', 'Erro ao buscar posts')
            res.redirect('/admin/forumAdmin')
        })
    }).catch((error) => {
        console.log('erro: '+ error)
        req.flash('error_msg', `Erro ao carregar mensagens ERRO: ${error}`)
        res.redirect('/admin/forumAdmin')
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

//Rota para as respostas

    //Processamento de dados das respostas
    forumRouter.post('/forumAdmin/:postId', (req, res) => {
        //Pegando dados de respostas
        const {postId} = req.params
        const {conteudo, dataCriacao} = req.body

        //Criando resposta no banco de dados
        const novaResposta = new responsesForum({
            conteudo: conteudo,
            postId: postId,
            dataCriacao: dataCriacao
        })

        //Salvando resposta no banco de dados
        novaResposta.save().then(() => {
            req.flash('success_msg', 'Resposta enviada com sucesso!')
            res.redirect('/admin/forumAdmin')
        }).catch((error) => {
            res.flash('error_msg', 'Erro ao enviar mensagem')
            res.redirect('/admin/forumAdmin')
        })
    })

//Rota para buscar por tópicos
    forumRouter.get('/forumAdminSearch', (req, res) => {
        const query = req.query.q || ''

        const regex = new RegExp(query, 'i')

        forumPost.find({titulo: {$regex: regex}})
        .then((posts) => {
            const postIds = posts.map((post) => post._id.toString())
            responsesForum.find({postId: {$in: postIds}})
            .then((respostas) => {
                res.render('admin/searchPosts', {posts, query, hasResults: posts.length, respostas, layout: 'main'})
            }).catch((error) => {
                console.log('erro: ' + error)
                req.flash('error_msg', 'Erro ao tentar buscar postss')
                res.redirect('admin/forumAdmin')
            })
        }).catch((error) => {
            req.flash('error_msg', 'Erro ao tentar buscar posts')
            res.redirect('/admin/forumAdmin')
        })
    })

export default forumRouter
