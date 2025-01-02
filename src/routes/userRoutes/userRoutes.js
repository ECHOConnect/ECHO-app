import { Router } from "express";
const userRouter = Router()
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import { isAuthenticated } from "../../config/auth.js";


//Rota de home page da aplicação
userRouter.get('/home', isAuthenticated, (req, res) => {
    //Pegando o nome de usuário logado
    const nomeuser = req.user
    //Buscando postagem no banco
    Post.find()
    //Reordenando do mais recente post
    .sort({createdDate: -1})
    //Populando - pegando o nome do autor pela id do autor da postagem
    .populate('author', 'nameuser')
    .then((post) => {
        res.render('user/home', {
            layout: 'main',
            nomeuser: nomeuser,
            post: post,
        })
    })
    .catch((error) => {
        console.log(`[debug]: Erro: ${error}`)
        req.flash('error_msg', 'Erro ao mostrar feed')
        res.redirect('/user/landingPage')
    })
})

//Rota para tela de postagem
userRouter.get('/post', isAuthenticated, (req, res) => {
    res.render('user/post', {
        layout: 'main'
    })
})

//Rota de processamento de dados
userRouter.post('/post', isAuthenticated, (req, res) => {
    //Pegando dados do form de postagem
    const {author, titulo, conteudo, tags} = req.body

    //Separando as tags no array por vírgulas
    const tagsArray = tags 
    ? tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '') 
    : []

    //Salvando novo post
    const newPost = new Post({
        author: author,
        titulo: titulo,
        conteudo: conteudo,
        tags: tagsArray,

    })
    //Salvando postagem
    newPost.save()
    .then(() => {
        req.flash('success_msg', 'Postagem feita com sucesso!')
        res.redirect('/user/home')
    })
    .catch((error) => {
        console.log(`[debug]: Erro: ${error}`)
        req.flash('error_msg', 'Erro ao fazer postagem, tente novamente!')
        res.redirect('/user/home')
    })
})

//Rota de processamento de dados de likes
userRouter.post('/like/:id', (req, res) => {
    //Pegando id do post na url
    const postId = req.params.id
    //Pegando id do usuário logado
    const userId = req.user._id

    //Buscando o post específico
    Post.findById(postId)
    .then((post) => {
        //Validando existência de post
        if(!post){
            req.flash('error_msg', 'Post não encontrado')
            res.redirect('/user/home')
        }
        const hasLiked = post.likes.some(id => id.toString()=== userId.toString())
        if(hasLiked){
            post.likes.pull(userId)
            post.save()
            .then(() => {
                res.json({msg: 'like removido'})
            }).catch((error) => {
                console.log(error)
                res.json({msg: 'Erro ao remover like'})
            })
        }
        else{
            post.likes.push(userId)
            post.save()
            .then(() => {
                res.json({msg: 'Like adicionado'})
            })
            .catch((error) => {
                console.log(error)
                res.json({msg: 'Erro ao adicionar like'})
            })
        }
    })
})


export default userRouter