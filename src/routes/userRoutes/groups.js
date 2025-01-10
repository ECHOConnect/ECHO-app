import { Router } from "express"
import Group from "../../models/Group.js"
const routerGroups = Router()

//Rota para grupos
    routerGroups.get('/group/:id', (req, res) => {
        const groupId = req.params.id
        const nomeuser = req.user

        Group.findById(groupId)
        .populate('members', 'nameuser profilePicture')
        .then((group) => {
            const infoMembersGroup = group.members 
            res.render('user/groups', {
                group: group,
                nomeuser: nomeuser,
                infoMembersGroup: infoMembersGroup
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
        })
    })

export default routerGroups