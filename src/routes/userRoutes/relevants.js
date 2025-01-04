import express from 'express'
const relevantRouter = express.Router()
import { marked, Marked } from 'marked'
import { isAuthenticated } from '../../config/auth.js'
import Post from '../../models/Post.js'

//Rota de posts mais curtidos
    relevantRouter.get('/relevants', isAuthenticated, (req, res) => {
        const nomeuser = req.user
        Post.find()
        .populate('author', 'nameuser profilePicture role')
        .sort({likes: -1})
        .then((posts) => {
            //Processamento do markdown para cada post
            const processedPost = posts.map(posts => ({
                ...posts.toObject(),
                conteudo: marked(posts.conteudo)
            }))
            res.render('user/relevants', {
                nomeuser: nomeuser,
                posts: processedPost
            })
        })
        .catch((error) => {
            req.flash('error_msg', 'Erro ao exibir posts relevântes erro: ' + error)
            res.redirect('/user/home')
        })
    })

relevantRouter.get('/searchPost', isAuthenticated, (req, res) => {
    const tag = req.query.tag
    const nomeuser = req.user
    if(!tag || tag === ''){
        req.flash('error_msg', 'O campo para busca não pode ser vazio')
        return res.render('user/home')
    }
    res.redirect(`/user/searchPost/${tag.trim()}?nameuser=${req.user.nameuser}`)
})

//Rota de busca de posts por tags
    relevantRouter.get('/searchPost/:tag', isAuthenticated, (req, res) => {
        //Pegando dados da url/busca
        const searchPost = req.params.tag
        const nomeuser = req.user
        //Buscando tag pesquisada no banco de dados
        Post.find({tags: {$regex: new RegExp(searchPost, 'i')}})
        .populate('author', 'nameuser profilePicture role')
        .exec()
        .then((post) => {
            //Processamento do markdown para cada post
            const processedPost = post.map(post => ({
                ...post.toObject(),
                conteudo: marked(post.conteudo)
            }))
            res.render('user/searchPost', {
                post: processedPost,
                searchPost,
                nomeuser: nomeuser,
                layout: 'main'
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ' + error)
            req.flash('error_msg', 'Erro ao buscar posts')
            res.redirect('/user/home')
        })
    })


export default relevantRouter