import { Router } from 'express'
import nodemailer from 'nodemailer'
const adminRoute = Router()
import { isAuthenticated ,isAdmin } from '../../config/auth.js'
import User from '../../models/User.js'

import dotenv from 'dotenv'
dotenv.config()

//Rota para o dasboard
    adminRoute.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
        //Buscando usuários no Banco de dados
        User.find()
        .then((usuarios) => {
            //Fazendo a contagem de usuários cadastrados
            User.countDocuments()
            .then((quantUser) => {
                res.render('admin/dashboard', {
                    layout: 'main',
                    usuarios: usuarios,
                    quantUser: quantUser
                })
            })
        })
        .catch((error) => {
            console.log('error' + error)
            req.flash('error_msg', 'Erro ao exibir dashboard')
            res.redirect('/user/home')
        })
    })

    //Rota para banir usuários
    adminRoute.get('/dashboard/:id', isAuthenticated, isAdmin, (req, res) => {
        const userId = req.params.id
        User.findById(userId)
        .then((user) => {
            if(!user){
                req.flash('error_msg', 'Usuário não encontrado!')
                res.redirect('/admin/dashboard')
            }

            res.render('admin/banUser', {
                layout: 'main', 
                user: user
            })
        })
        .catch((error) => {
            console.log('erro: ' + error)
            req.flash('error_msg', 'Erro ao tentar banir usuário')
            res.redirect('/admin/dashboard')
        })
    })

    //Configuração do nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    //Função que envia o email
    function sendMail(username, useremail){
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: useremail,
            subject: 'Nota de banimento',
            text: `Olá, ${username}, sua conta foi banida por motivos de violações às nossas políticas. Caso tenha dúvida entre em contato com o nosso suporte`,
        }
        return transporter.sendMail(mailOption)
    }

    //Função para enviar email em caso de edição de dados
    function notifyUser(to, subject, text){
        const mailOption = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: text
        }
        return transporter.sendMail(mailOption)
    }

    //Rota para receber os dados de banimento
    adminRoute.post('/dashboard/:id', (req, res) => {
        const userId = req.params.id
        const curretAdminId = req.user.id

        //Promisse que retorna condições para o banimento
        Promise.all([
            User.findById(userId),
            User.findById(curretAdminId)
        ])
        .then(([adminToban, curretAdmin]) => {
            //Condições para banimentos
            if(!adminToban || !curretAdmin){
                req.flash('error_msg', 'Admin não encontrado')
                return res.redirect('/admin/dashboard')
            }
            if(adminToban.id === curretAdmin.id){
                req.flash('error_msg', 'Você não pode banir a própria conta')
                return res.redirect('/admin/dashboard')
            }
            if(adminToban.role === 'SUPER_ADMIN'){
                req.flash('error_msg', 'Você não pode banir um Super Admin')
                return res.redirect('/admin/dashboard')
            }
            if(curretAdmin.role !== 'SUPER_ADMIN'){
                req.flash('error_msg', 'Você não tem permissões suficientes para banir outro admin')
                return res.redirect('/admin/dashboard')
            }

            //Banindo caso não entrar em nenhuma das condições
            return User.findByIdAndDelete(adminToban.id)
                .then((deleteUser) => {
                    if(!deleteUser){
                        req.flash('error_msg', 'Usuário não encontrado')
                        return res.redirect('/admin/dashboard')
                    }
                    return sendMail(deleteUser.username, deleteUser.useremail)
                    .then(() => {
                        req.flash('success_msg', 'Usuário banido com sucesso e E-mail de notificação enviados!')
                        res.redirect('/admin/dashboard')
                    })
                })
                .catch((error) => {
                    console.log(error)
                    req.flash('error_msg', 'Ocorreu um erro ao tentar banir o usuário')
                    return res.redirect('/admin/dashboard')
                })
        })
        .catch((error) => {
            req.flash('error_msg', 'Erro ao excluir usuário' + error)
            res.redirect('/admin/dashboard')
        })
    })

    //Rota de ativação e desativação de usuários (renderização de página)
    adminRoute.get('/OnOffUser/:id', isAuthenticated, isAdmin, (req, res) => {
        //Pegando id da url para a renderização da página
        const userId = req.params.id

        //Filtrando usuário pelo id
        User.findById(userId)
        .then((user) => {
            if(!user){
                req.flash('error_msg', 'Usuário não encontrado')
                return res.redirect('/admin/dashboard')
            }
            //Passando dasos de usuário para o arquivo
            res.render('admin/OnOffUser', {
                layout: 'main',
                user: user
            })
        })
        .catch((error) => {
            console.log(`Erro: ${error}`)
            req.flash('error_msg', 'Houve um erro ao tentar desativar/ativar usuário')
            res.redirect('/admin/dashboard')
        })
    })

    //Rota de ativação e desativação de usuários (revebimento de dados)
    adminRoute.post('/OnOffUser/:id', (req, res) => {
        const userId = req.params.id
        const action = req.body.action
        const curretAdminId = req.user.id
    
        console.log(`[DEBUG] Início da rota /OnOffUser. ID do usuário: ${userId}, Ação: ${action}`)

        console.log(`[DEBUG]: id do admin que quer fazer a ação: ${curretAdminId}`)
        //Promisse para usar as condições
            Promise.all([
                User.findById(userId),
                User.findById(curretAdminId)
            ])
            .then(([userToOnOff, curretAdmin]) => {
                //Condições de proibição para ativação e desativação
                if (!userToOnOff || !curretAdmin) {
                    console.log('[DEBUG] Usuário não encontrado.')
                    req.flash('error_msg', 'Usuário não encontrado')
                    throw new Error('Usuário não encontrado') // Lança erro para o `catch`
                }
                if(userToOnOff.id === curretAdmin.id){
                    req.flash('error_msg', 'Você não pode ATIVAR ou DESATIVAR a sua própria conta')
                    return res.redirect('/admin/dashboard')
                }
                if(userToOnOff.role === 'SUPER_ADMIN'){
                    req.flash('error_msg', 'Você não pode ATIVAR OU DESATIVAR um Super Admin')
                    return res.redirect('/admin/dashboard')
                }
                if(userToOnOff.role === 'admin' && curretAdmin.role === 'admin'){
                    req.flash('error_msg', 'Você não tem permições suficientes para ATIVAR ou DESATIVAR um admin')
                    return res.redirect('/admin/dashboard')
                }
                //Retornando a desativação da conta caso as condições anteriores forem falsas
                return User.findById(userToOnOff.id)
                .then((user) => {
                    //Pegando estado atual do email
                    const oldStatus = user.emailVerificado

                    if (action === 'desactivate') {
                        console.log('[DEBUG] Desativando usuário.')
                        user.emailVerificado = false
                        //Se caso o email estava ativado e for desativado envia esse email
                        notifyUser(
                            user.useremail,
                            `Desativação de Conta`,
                            `Olá, ${user.nameuser}. Você está recebendo esse E-mail pois sua conta ECHO Connect foi desativada!\n\nSe caso tiver alguma dúvida sobre o motivo da desativação, entre em contato com o nosso suporte que responderemos o mais rápido possível.`
                        )
                        req.flash('success_msg', `O usuário, ${user.nameuser}, foi DESATIVADO do sistema com sucesso!`)
                    } 
                    else if (action === 'activate') {
                        console.log('[DEBUG] Ativando usuário.')
                        user.emailVerificado = true
                        notifyUser(
                            user.useremail,
                            `Ativação de Conta`,
                            `Olá, ${user.nameuser}. Você está recebendo esse E-mail pois sua conta ECHO Connect foi Ativada!\n\nSeja bem vindo de volta!.`
                        )
                        req.flash('success_msg', `O usuário, ${user.nameuser}, foi ATIVADO no sistema com sucesso!`)
                    } else {
                        console.log('[DEBUG] Ação inválida recebida.')
                        req.flash('error_msg', 'Ação inválida!')
                        throw new Error('Ação inválida') // Lança erro para o `catch`
                    }
        
                    console.log('[DEBUG] Salvando alterações no banco de dados...')
                    return user.save()
                })
                .then(() => {
                    console.log('[DEBUG] Alterações salvas com sucesso.')
                    res.redirect('/admin/dashboard') // Redireciona após sucesso
                })
                .catch((error) => {
                    console.error(`[DEBUG] Erro no processamento: ${error.message}`)
                    req.flash('error_msg', 'Houve um erro ao processar a solicitação.')
                    if (!res.headersSent) {
                        res.redirect('/admin/dashboard') // Certifica-se de não redirecionar duas vezes
                    }
                })
    
            })
    })
    
    //Rota para editar dados de usuários
    adminRoute.get('/editUser/:id', (req, res) => {
        //Pegando dados de id da url
        const userId = req.params.id
        const curretUser = req.user.id

        Promise.all([
            User.findById(userId),
            User.findById(curretUser)
        ])
        .then(([userToEdit, curretUser]) => {
            if(userToEdit.id === curretUser.id){
                req.flash('error_msg', 'Você não pode editar os próprios dados')
                return res.redirect('/admin/dashboard')
            }
            if(userToEdit.role === 'SUPER_ADMIN'){
                req.flash('error_msg', 'Você não pode editar dados de um SUPER ADMIN')
                return res.redirect('/admin/dashboard')
            }
            if(userToEdit.role === 'admin' && curretUser.role === 'admin'){
                req.flash('error_msg', 'Você não pode editar dados de outro admin')
                res.redirect('/admin/dashboard')
            }

            //Buscando user pelo id
                User.findById(userToEdit)
                .then((dadosUser) => {
                    if(!dadosUser){
                        req.flash('error_msg', 'Usuário não encontrado')
                        return res.render('/admin/dashboard')
                    }

                    //Mandando os dados atuais para o forms
                    res.render('admin/editUser', {
                        layout: 'main',
                        dadosUser: dadosUser
                    })
                })
                .catch((error) => {
                    res.status(400).send('Erro ao carregar página ' + error )
                })
            })
        })

    //Rota para receber os dados de edição
    adminRoute.post('/editUser', (req, res) => {
        //Recebendo dados do formulário
        const {username, nameuser, useremail, role} = req.body

        //Buscando usuário no banco de dados e salvando as alterações
        User.findOne({_id: req.body.id})
        .then((userUpdate) => {

            //Armazenando email e role antes da modificação
            const oldEmail = userUpdate.useremail
            const oldRole = userUpdate.role

            //Recebendo mudanças do forms
            userUpdate.username = username,
            userUpdate.nameuser = nameuser,
            userUpdate.useremail = useremail,
            userUpdate.role = role

            //Salvando dados de edição
            userUpdate.save()
            .then((user) => {
                req.flash('success_msg', `Dados do usuário ${user.nameuser} editados com sucesso!`)

                //Condições que fazem o email ser enviado
                if(oldEmail !== userUpdate.useremail){
                    //Email enviado para o antigo email
                    notifyUser(
                        oldEmail,
                        `Alteração de E-mail - ECHO Connect`,
                        `Olá, ${nameuser}. O e-mail associado à sua conta foi alterado para ${useremail}. Caso não tenha solicitado essa alteração, entre em contato com o suporte.`
                    )
                    //Email enviado para o novo email
                    notifyUser(
                        useremail,
                        'Bem-vindo ao Novo E-mail - ECHO Connect',
                        `Olá, ${nameuser}. Seu e-mail foi atualizado com sucesso no ECHO Connect.`
                    )
                }
                //Email se caso o role (função do usuário for alterado)
                if(oldRole !== userUpdate.role){
                    notifyUser(
                        useremail,
                        'Alteração de Permissão - ECHO Connect',
                        `Olá, ${nameuser}. Seu papel no sistema foi alterado para ${role}. Caso não tenha solicitado essa mudança, entre em contato com o suporte.`
                    )
                }
                return res.redirect('/admin/dashboard')
            })
            .catch((error) => {
                req.flash('error_msg', `Erro ao tentar editar dados do usuário erro: ${error}`)
                console.log(`Erro ao editar: ${error}`)
            })
        })
        .catch((error) => {
            req.flash('error_msg', `Erro ao tentar editar dados do usuário erro: ${error}`)
            res.redirect('/admin/dashboard')
        })
    })


//Rota para o painel de gerenciamento de posts
    adminRoute.get('/managePosts', isAuthenticated, isAdmin, (req, res) => {
        res.render('admin/managePosts', {layout: 'main'})
    })

//Rota para o painel de visão geral do sistema
    adminRoute.get('/generalVision', isAuthenticated, isAdmin, (req, res) => {
        res.render('admin/generalVision', {layout: 'main'})
    })



export default adminRoute