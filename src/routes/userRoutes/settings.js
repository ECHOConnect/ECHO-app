import { Router } from "express"
import User from "../../models/User.js"
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()
const routerSettings = Router()

//Rota de exibição de configurações
    routerSettings.get('/settings/:id', (req, res) => {
        const userId = req.params.id
        const nomeuser = req.user
        res.render('user/settings', {
            nomeuser: nomeuser
        })
    })

//Rota de atualização de dados
    routerSettings.post('/updateData/:id', (req, res) => {
        const {username, nameuser, useremail, biography} = req.body
        const userId = req.params.id
        console.log(userId)
        User.findOne({useremail})
        .then((existingUser) => {
            if(existingUser && existingUser._id.toString() !== userId){
                req.flash('error_msg', 'E-mail já existe!')
                return res.redirect(req.headers.referer)
            }

            return User.findById(userId)
        })
        .then((user) => {
            console.log(user.useremail, useremail)
            if(!user){
                req.flash('error_msg', 'Usuário não encontrado')
                return res.redirect(req.headers.referer)
            }
            if(user.useremail !== useremail){
                const verificationToken = crypto.randomBytes(20).toString('hex')
                const verificationTokenExpire = Date.now() + 3600000

                return User.findByIdAndUpdate(userId, {
                    useremail: useremail,
                    tokenVerificacao: verificationToken,
                    emailVerificado: false,
                    verificationTokenExpire: verificationTokenExpire 
                    
                }, {new: true})
            }
            else{
                return User.findByIdAndUpdate(userId, {
                    username: username, 
                    nameuser: nameuser,
                    biography: biography
                }, {new: true})
            }
        })
        .then((newData) => {
            if(!newData){
                req.flash('error_msg', 'Erro ao atualizar dados')
                return res.redirect(req.headers.referer)
            }
            if (newData.tokenVerificacao) {
                // Configuração do transporte de e-mail
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                })

                // Opções do e-mail de verificação de e-mail
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: newData.useremail,
                    subject: 'Verifique seu novo e-mail',
                    text: `Olá, ${newData.nameuser},\n\nVocê alterou seu e-mail em nossa plataforma. Para confirmar essa alteração, clique no link abaixo:\n\nhttp://localhost:8080/verify-email/${newData.tokenVerificacao}\n\nSe você não fez essa alteração, entre em contato com o suporte imediatamente.`
                }

                // Envia o e-mail
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error('Erro ao enviar o e-mail de verificação:', err);
                        return res.status(500).json({ message: 'Erro ao enviar o e-mail de verificação.' });
                    }
                    console.log('E-mail de verificação enviado: ' + info.response)
                })
            }

            // Responde ao cliente após a atualização
            req.flash('success_msg', 'Dados atualizados com sucesso!')
            res.redirect(req.headers.referer)
        })
        .catch((error) => {
            console.log('[debug-error]: ', error)
        })
    })


export default routerSettings