import { Router } from "express"
import Group from "../../models/Group.js"
import User from "../../models/User.js"
import { connections } from "mongoose"
const routerGroupTools = Router()

//Rota para a página de ferramentas de grupos de estudos
routerGroupTools.get('/groupTools/:groupId', (req, res) => {
    //Pegando dados do formulário
    const groupId = req.params.groupId
    const nomeuser = req.user
    const userId = req.user._id
    //Buscando grupo pela id
    Group.findById(groupId)
    //Populando o campo de membros para especificar os membros
    .populate('members.user', 'nameuser _id role')
    .then((group) => {
        if(!group){
            req.flash('error_msg', 'Grupo não encontrado')
            res.redirect('/home/groupList')
        }
        //Buscando os usuários pelo id
        User.findById(userId)
        //Populando as conexões que os usuários têm
        .populate('connections', 'nameuser role')
        .then((user) => {
            //Verificando a existêcia de conexões com o usuário logado
            const existingConnection = group.members.map(member => member.user._id.toString())
            //Filtrando as conexões que não fazem parte do user
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

// Rota para processamento de dados e salvamento de modificações de grupos
routerGroupTools.post('/groupTools/:groupId', (req, res) => {
    const groupId = req.params.groupId;
    const { nameGroup, description, status, admin, members } = req.body;

    // Construir objeto de atualização dinamicamente
    const updateData = {};

    // Campos simples que podem ser atualizados
    if (nameGroup) updateData.nameGroup = nameGroup;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    // Campos que exigem formatação especial
    if (Array.isArray(members) && members.length > 0) {
        updateData.$addToSet = {
            ...(updateData.$addToSet || {}),
            members: { $each: members.map((memberId) => ({ user: memberId })) },
        };
    }

    if (Array.isArray(admin) && admin.length > 0) {
        updateData.$addToSet = {
            ...(updateData.$addToSet || {}),
            admin: { $each: admin.filter(Boolean) }, // Filtra valores válidos
        };
    }

    // Verificar se há algo para atualizar
    if (Object.keys(updateData).length === 0) {
        req.flash('info_msg', 'Nenhuma alteração foi feita.');
        return res.redirect(req.headers.referer);
    }

    // Atualizar grupo no banco de dados
    Group.findByIdAndUpdate(groupId, updateData, { new: true, runValidators: true })
        .then(() => {
            req.flash('success_msg', 'Dados do grupo atualizados com sucesso!');
            res.redirect(`/user/group/${groupId}`);
        })
        .catch((error) => {
            console.error('[Erro ao atualizar grupo]:', error);
            req.flash('error_msg', 'Erro ao tentar atualizar dados do grupo.');
            res.redirect(req.headers.referer);
        });
});



export default routerGroupTools