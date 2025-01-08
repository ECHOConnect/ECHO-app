import { Router } from "express";
const userRouter = Router()
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import { marked, Marked } from "marked";
import { isAuthenticated } from "../../config/auth.js";
import Comentario from "../../models/Comments.js";


//Rota de home page da aplicação
userRouter.get('/home', isAuthenticated, (req, res) => {
    //Pegando o nome de usuário logado
    const nomeuser = req.user
    //Buscando postagem no banco
    Post.find()
    //Reordenando do mais recente post
    .sort({createdDate: -1})
    //Populando - pegando o nome do autor pela id do autor da postagem
    .populate('author', 'nameuser profilePicture role biography')
    .populate({
        path: 'comentarios',
        populate: {
            path: 'author',
            select: 'nameuser profilePicture biography'
        }
    })
    .then((post) => {
        //Processamento do markdown para cada post
        const processedPost = post.map(post => ({
            ...post.toObject(),
            conteudo: marked(post.conteudo)
        }))
        res.render('user/home', {
            layout: 'main',
            nomeuser: nomeuser,
            post: processedPost,
            comments: post
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
    const nomeuser = req.user
    res.render('user/post', {
        layout: 'main',
        nomeuser: nomeuser
    })
})

//Rota de processamento de dados
userRouter.post('/post', isAuthenticated, (req, res) => {
    //Pegando dados do form de postagem
    const {author, titulo, conteudo, tags} = req.body
    

    //Separando as tags no array por vírgulas e convertendo para minúsculas
    const tagsArray = tags 
    ? tags.toLowerCase()
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
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

userRouter.post('/like/:id', (req, res) => {
    // Pegando id do post na URL
    const postId = req.params.id;
    // Pegando id do usuário logado
    const userId = req.user._id;

    // Buscando o post específico
    Post.findById(postId)
    .populate('likes', 'nameuser') // Preenche os dados dos likes (nameuser)
    .then((post) => {
        // Validando existência do post
        if (!post) {
            return res.json({ msg: 'Post não encontrado' });
        }

        // Verificando se o usuário já curtiu o post
        const hasLiked = post.likes.some(like => like._id.toString() === userId.toString());

        if (hasLiked) {
            // Se já curtiu, remove o like
            post.likes.pull(userId);
            post.save()
            .then(() => {
                // Envia a resposta indicando que o like foi removido
                res.json({ msg: 'Like removido', likes: post.likes.length });
            })
            .catch((error) => {
                console.log(error);
                res.json({ msg: 'Erro ao remover like' });
            });
        } else {
            // Se não curtiu, adiciona o like
            post.likes.push(userId);
            post.save()
            .then(() => {
                // Envia a resposta indicando que o like foi adicionado
                res.json({ msg: 'Like adicionado', likes: post.likes.length });
            })
            .catch((error) => {
                console.log(error);
                res.json({ msg: 'Erro ao adicionar like' });
            });
        }
    })
    .catch((error) => {
        console.log(error);
        res.json({ msg: 'Erro ao buscar o post' });
    });
});

//Rota para logout do sistema
userRouter.get('/logout', (req, res, next) => {
    req.logout((error) => {
        if(error){
            return next(error)
        }
        req.flash('success_msg', 'Deslogado com sucesso!')
        res.redirect('/user/login')
    })
})


export default userRouter