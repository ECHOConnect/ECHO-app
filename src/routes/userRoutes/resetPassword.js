import { Router } from "express";
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import User from "../../models/User.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const routeReset = Router()

//Rota de renderização de página de envio de link para redefinição
    routeReset.get('/resetPassword', (req, res) => {
        res.render('user/resetPassword', {
            layout: 'main-no-header-footer'
        })
    })

    //Configuração do nodemailer para reutilização em rotas de envio
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    function sendMail(to, from, subject, text){
        const mailOption = {
            to: to,
            from: from,
            subject: subject,
            text: text
        }

        return transporter.sendMail(mailOption)
    }

//Rota para envio de redefinição de email
    routeReset.post('/resetPassword', (req, res) => {
        //Pegando email do form
        const {useremail} = req.body

        User.findOne({useremail: useremail})
        .then((user) => {
            if(!user){
                req.flash('error_msg', 'O usuário não existe')
                return res.redirect('/user/login')
            }

            //Gerando token de verificação de email e tempo para expirar
            const token = crypto.randomBytes(32).toString('hex')
            const expire = Date.now() + 3600000

            //Atribuindo token e tempo para expirar ao banco de dados
            user.resetPasswordToken = token
            user.resetPasswordExpire = expire

            //Salvando mudança no banco de dados
            user.save()
            .then(() => {
                //Enviando email com o link para redefinição de senha
                sendMail(
                    user.useremail,
                    process.env.EMAIL_USER,
                    `Redefinição de senha`,
                    `Olá ${user.nameuser}. Você está recebendo isso porque solicitou a mudança de senha no ECHO Connect.\n\nClique no link abaixo para redefinir sua senha\n\n
                    http://localhost:${process.env.PORT}/user/newPass?token=${token}`
                )
                req.flash('success_msg', 'E-mail de redefinição enviado com sucesso!')
                res.redirect('/user/login')
            })
            .catch((error) => {
                console.log(`[debug]: Erro: ${error}`)
                req.flash('error_msg', 'Erro ao tentar enviar E-mail' + error)
                res.redirect('/user/login')
            })
        })
    })

//Rota de renderização de página de mudança de senha
    routeReset.get('/newPass', (req, res) => {
        //Pegando toke da url
        const {token} = req.query

        //Buscando usuário com o token específico
        User.findOne({resetPasswordToken: token})
        .then((user) => {
            if(!user){
                req.flash('error_msg', 'O usuário não existe')
                return res.redirect('/user/login')
            }

            //Debug para verificar erros
            console.log(`[debug]: token: ${token}`)
            console.log(`[debug]: usuário: ${user}`)

            //Verificando se o tempo de expiração ainda não acabou
            if(user.resetPasswordExpire < Date.now()){
                req.flash('error_msg', 'Token expirado')
                return res.redirect('/user/newPass')
            }
            
            //renderizando tela de atualizar senha passando o token
            res.render('user/newPass', {
                token: token, 
                layout: 'main-no-header-footer'})
        })
        .catch((error) => {
            console.log(`Erro ao validar o Token ERRO: ${error}`)
            req.flash('error_msg', 'Erro ao validar token')
            res.redirect('/user/newPass')
        })
    })

//Rota de processamento de dados de modificação de senha
    routeReset.post('/newPass', (req, res) => {
        //Pegando dados do usuário
        const {token, userpass} = req.body

        //Buscando usuário específico no BD para modificação de senha
        User.findOne({resetPasswordToken: token, resetPasswordExpire: {$gt: Date.now()}})
        .then((user) => {
            if(!user){
                req.flash('error_msg', 'Token inválido ou expirado')
                return res.redirect('/user/resetPassword')
            }

            //Criptografando a nova senha
            const hashSalts = 10
            user.userpass = bcrypt.hashSync(userpass, hashSalts)

            //Redefinindo tempo e token no bd
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            //Salvando o usuário com a nova senha
            return user.save()
            .then(() => {
                req.flash('success_msg', 'Senha alterada com sucesso!')
                res.redirect('/user/login')
            })
            .catch((error) => {
                console.log(`erro: ${error}`)
                req.flash('error_msg', 'Erro ao alterar senha, por favor tente novamente!')
                res.redirect('/user/newPass')
            })
        })
    })

export default routeReset