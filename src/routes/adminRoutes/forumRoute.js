import { Router } from 'express'
import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import forumPost from '../../models/Forum_Admin.js'
import responsesForum from '../../models/RespForum_Admin.js'
import User from '../../models/User.js'
import { isAdmin, isAuthenticated } from '../../config/auth.js'
const forumRouter = Router()

//Configuração das variáveis de ambiente
    import dotenv, { populate } from 'dotenv'
    dotenv.config()

//Rota para o forúm 
forumRouter.get('/forumAdmin', isAuthenticated, isAdmin, (req, res) => {
    //Buscando mensagens no banco de dados
    forumPost.find()
    .sort({dataCriacao: -1})
    //Buscando as postagens de forma individual
    .populate('author', 'nameuser')
    .then((postagem) => {
        //Buscando respostas da respectiva postagem
        const postsWithResponsesPromises = postagem.map((postagem) => {
            //Retornando as respostas com base no id da postagem
            return responsesForum.find({postId: postagem._id})
            //Ordenando da resposta mais recente
            .sort({dataCriacao: - 1})
            .populate('author', 'nameuser')
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

//Configuração do nodemailer para envio de emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS  
        }
    })

//Função para o envio do email
    const sendEmail = (to, subject, text) => {
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        }

        return transporter.sendMail(mailOption)
    }

//Rota para processamento de dados do forúm
forumRouter.post('/forumAdmin', (req, res) => {
    //Pegando dados do forms do post 
    const {titulo, conteudo, dataCriacao} = req.body
    const author = req.body.author

    //Inserindo dados da postagem no banco de dados
    const novaPostagem = new forumPost({
        titulo: titulo,
        conteudo: conteudo,
        dataCriacao: dataCriacao,
        author: author
    })

    //Salvando no banco de dados
    novaPostagem
    .save()
    //Buscando os roles específicos
    .then(() => {
        return User.find({role: {$in: ['admin', 'SUPER_ADMIN'] }})
    })
    //Buscando os emails de todos os admins e Super Admins
    .then((admins) => {
        const adminsEmail = admins.map(admins => admins.useremail)

        //Enviando E-mail
        sendEmail(
            `${adminsEmail.join(',')}`,
            `Nova postagem no Forúm (${titulo})`,
            `Uma nova postagem foi criada no fórum.\n\nTítulo: ${titulo}\nConteúdo: ${conteudo}`
        )
    })
    .then(() => {
        console.log(`[debug]: usuário: ${author}`)
        req.flash('success_msg', 'Mensagem enviada com sucesso!')
        res.redirect('/admin/forumAdmin')
    }).catch((error) => {
        req.flash('error_msg', `Erro ao enviar mensagem ERRO: ${error}`)
        res.redirect('/admin/forumAdmin')
    })
})

//Rota para as respostas

    //Processamento de dados das respostas
    forumRouter.post('/forumAdmin/:postId', isAuthenticated, isAdmin, (req, res) => {
        //Pegando dados de respostas
        const {postId} = req.params
        const {conteudo, dataCriacao, author} = req.body

        console.log('[debug]: id do usuário da resposta: ', author)

        //Criando resposta no banco de dados
        const novaResposta = new responsesForum({
            conteudo: conteudo,
            postId: postId,
            dataCriacao: dataCriacao,
            author: author
        })

        //Salvando resposta no banco de dados
        novaResposta
        .save()
        .then(() => {
            return User.find({role: {$in: ['admin', 'SUPER_ADMIN'] }})
        })
        .then((admins) => {
            const adminsEmail = admins.map(admins => admins.useremail)
            //Enviando o email
            sendEmail(
                `${adminsEmail}`,
                `Nova resposta no Forúm`,
                `Uma nova resposta foi criada no fórum.\n\nConteúdo: ${conteudo}`
             )
        })
        .then(() => {
            req.flash('success_msg', 'Resposta enviada com sucesso!')
            res.redirect('/admin/forumAdmin')
        }).catch((error) => {
            console.log('[debug]: erro: ', error)
            req.flash('error_msg', 'Erro ao enviar mensagem' + error)
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

    //Rota para editar respostas
    forumRouter.post('/forumAdmin/:respostaId', isAuthenticated, isAdmin, (req, res) => {
        //Pegando dados do formulário
        const respostaId = req.params.respostaId
        const conteudo = req.body.conteudo

        //Buscando e editando conteúdo pelo id
        responsesForum.findByIdAndUpdate(respostaId, {conteudo}, {new: true})
        .then(() => {
            req.flash('success_msg', 'Comentário editado com sucesso!')
            res.redirect('/admin/forumAdmin')
        })
        .catch((error) => {
            console.log(`[debug]: Erro: ${error}`)
            req.flash('error_msg', 'Erro ao tentar editar comentário')
            res.redirect('/admin/forumAdmin')
        })
    })

export default forumRouter
