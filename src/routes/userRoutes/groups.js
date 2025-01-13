import { Router } from "express"
import Group from "../../models/Group.js"
import PostsGroups from "../../models/Post_group.js"
import { marked }  from 'marked'
import { content } from "googleapis/build/src/apis/content/index.js"
const routerGroups = Router()

//Rota para detalhes de grupos já na parte interna
    routerGroups.get('/group/:id', (req, res) => {
        const groupId = req.params.id
        const nomeuser = req.user
        const userId = req.user._id

        Group.findById(groupId)
        .populate('members.user', 'nameuser profilePicture')
        .then((group) => {
            PostsGroups.find({group: groupId})
            .populate('author', 'nameuser profilePicture role')
            .populate('replies.author', 'nameuser profilePicture')
            .then((posts) => {
                /*Processando dados em markdown
                */
                const processedPost = posts.map(posts => ({
                    ...posts.toObject(),
                    content: marked(posts.content)

                }))
                // Verifica se é um grupo privado e se o usuário é membro
                if (group.status === 'private') {
                    const isMember = group.members.some((member) => String(member.user._id) === String(userId));
                    if (!isMember) {
                        req.flash('error_msg', 'Você não tem permissão para acessar este grupo.');
                        return res.redirect('/user/explorerGroups');
                    }
                }
                if(!group.members){
                    req.flash('error_msg', 'Usuário não faz parte do grupo')
                    res.redirect('/user/groupList')
                }
                // const infoMembersGroup = group.members.user
                res.render('user/groups', {
                    group: group,
                    nomeuser: nomeuser,
                    posts: processedPost,
                    members: group.members,
                    userLog: {
                        _id: String(req.user._id)
                    }
                })
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
        })
    })

     //Comentários dos posts
     routerGroups.post('/group/comment/:id', (req, res) => {
        //Pegando dados de comentários
        const postId = req.params.id
        const {author, content} = req.body

        //Buscando o post que foi comentado
        PostsGroups.findById(postId)
        .then((post) => {
            if(!post){
                req.flash('error_msg', 'Postagem não encontrada')
                res.redirect(req.headers.referer)
            }
            //Incrementando comentários aos posts
            const newComment = { author, content }
            post.replies.push(newComment)

            //Salvando postagem com o comentário
            return post.save()
        })
        .then((commented) => {
            req.flash('success_msg', 'Comentário adicionado com sucesso')
            res.redirect(req.headers.referer)
        })
        .catch((error) => {
            req.flash('error_msg', 'Erro ao tentar adicionar comentário')
            res.redirect(req.headers.referer)
            console.log(error)
        })
     })

    //Rota para postagens nos grupos
    routerGroups.get('/postgroup/:id', (req, res) => {
        const groupId = req.params.id
        const nomeuser = req.user
        Group.findById(groupId)
        .then((group) => { 
            res.render('studyGroups/Postgroup', {
                group: group,
                nomeuser: nomeuser
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
        })
    })

    //Rota de processamento de dados para as publicações
    routerGroups.post('/postgroup', (req, res) => {
        const { content, author, group } = req.body
        if(!content){
            req.flash('error_msg', 'A postagem não pode ser vazia')
            res.redirect(req.headers.referer)
        }

        const newPostGroup = new PostsGroups({
            content: content,
            author: author,
            group: group
        })

        newPostGroup.save()
        .then(() => {
            req.flash('success_msg', `Postagem feita com sucesso!`)
            res.redirect(`/user/group/${group}`)
        })
        .catch((error) => {
            req.flash('error_msg', '[debug]: Erro: ', error)
            res.redirect(req.headers.referer)
        })
    })

    //Listagem de grupos diversos
    routerGroups.get('/explorerGroups', (req, res) => {
        const nomeuser = req.user
        Group.find()
        .populate('createdBy', 'nameuser profilePicture')
        .populate('members.user', 'nameuser profilePicture role')
        .then((groups) => {
            res.render('studyGroups/explorerGroups', {
                groups: groups,
                nomeuser: nomeuser,
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
        })
    })

export default routerGroups