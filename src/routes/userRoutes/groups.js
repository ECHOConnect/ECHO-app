import { Router } from "express"
import Group from "../../models/Group.js"
import PostsGroups from "../../models/Post_group.js"
const routerGroups = Router()

//Rota para detalhes de grupos já na parte interna
    routerGroups.get('/group/:id', (req, res) => {
        const groupId = req.params.id
        const nomeuser = req.user

        Group.findById(groupId)
        .populate('members.user', 'nameuser profilePicture')
        .then((group) => {
            PostsGroups.find({group: groupId})
            .populate('author', 'nameuser profilePicture role')
            .then((posts) => {
                if(!group.members){
                    req.flash('error_msg', 'Usuário não faz parte do grupo')
                    res.redirect('/user/groupList')
                }
                // const infoMembersGroup = group.members.user
                res.render('user/groups', {
                    group: group,
                    nomeuser: nomeuser,
                    posts: posts,
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

export default routerGroups