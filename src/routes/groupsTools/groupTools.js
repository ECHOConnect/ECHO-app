import { Router } from "express"
import Group from "../../models/Group.js"
import User from "../../models/User.js"
import { connections } from "mongoose"
const routerGroupTools = Router()


routerGroupTools.get('/groupTools/:groupId', (req, res) => {
    const groupId = req.params.groupId
    const nomeuser = req.user
    const userId = req.user._id

    Group.findById(groupId)
    .populate('members.user', 'nameuser role')
    .then((group) => {
        if(!group){
            req.flash('error_msg', 'Grupo não encontrado')
            res.redirect('/home/groupList')
        }
        User.findById(userId)
        .populate('connections', 'nameuser role')
        .then((user) => {
            const existingConnection = group.members.map(member => member.user._id.toString())
            const notConnection = user.connections.filter(connections => !existingConnection.includes(connections._id.toString()))
            if(!user){
                req.flash('error_msg', 'Erro ao carregar conexões')
                res.redirect('/home/groupList')
            }
            res.render('studyGroups/groupTools', {
                group: group,
                nomeuser: nomeuser,
                connections: notConnection
            })
        })
        .catch((error) => {
            console.log('[debug]: Erro: ', error)
        })
    })
    .catch((error) => {
        console.log('[debug]: Erro: ', error)
    })
   
})


export default routerGroupTools