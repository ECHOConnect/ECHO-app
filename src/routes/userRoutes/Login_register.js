import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import passport from 'passport'
import dotenv from 'dotenv'
dotenv.config()
import { text } from 'stream/consumers'
const loginRouter = Router()

//Rota para fazer login
loginRouter.get('/login', (req, res) => {
    res.render('user/login', {layout: 'main-no-header-footer'})
})

//Autenticando usuário
loginRouter.post('/login', (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: '/user/home',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next)
})

//Rota para se cadastrar
loginRouter.get('/register', (req, res) => {
    res.render('user/register', {layout: 'main-no-header-footer'})
})

loginRouter.post('/register', (req, res) => {
    //Pegando dados do formulário de cadastro
   const {username, nameuser, useremail, userpass, birthdayuser, role, emailVerificado} = req.body

   //Verificando se o email já existe 
   User.findOne({useremail})
   .then((user) => {
        if(user){
           req.flash('error_msg', 'E-mail já existe')
           return res.redirect('/user/register')
        }

        //Gerando token de autenticação
        const token = crypto.randomBytes(32).toString('hex')

        //Criptografando senha e salvando usuário
        const roundSalts = 10
        bcrypt.hash(userpass, roundSalts)
        .then((hashedPassword) => {
            const newUser = new User({
                username: username,
                nameuser: nameuser,
                useremail: useremail,
                userpass: hashedPassword,
                birthdayuser: birthdayuser,
                role: role,
                emailVerificado: emailVerificado,
                tokenVerificacao: token,
            })
            newUser.save()
            .then((savedUser) => {
                //configurando transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                })
                //Gerando o link de verificação
                const link = `http://localhost:8080/user/verifyEmail/${token}`

                //Configuração do conteúdo do email
                const mailOption = {
                    from: 'echoconnect472@gmail.com',
                    to: savedUser.useremail,
                    subject: 'Confirmação de E-mail',
                    text: `Olá, ${savedUser.nameuser}, seja bem vido a nossa comudidade ECHO Connect\n\nPara validar seu E-mail clique no link logo abaixo, é rápido! 😀\n\n${link}\n\nApós validar você já pode fazer o seu login: \n\n http://localhost:8080/user/login`
                }

                //Enviando o E-mail
                return transporter.sendMail(mailOption)
            })
            .then(() => {
                req.flash('success_msg', 'E-mail de verificação de conta enviado!')
                return res.redirect('/user/login')
            })
            .catch((error) => {
                console.log('erro é: ' + error)
                req.flash('error_msg', 'Houve um erro ao tentar se cadastrar, tente novamente!')
                res.redirect('/user/register')
            })
        }).catch((error) => {
            res.send('Erro ao gerar hash de senha erro: ' + error)
        })
   }).catch((error) => {
        res.send('Erro ao tentar buscar usuário')
   })
})

//Rota para validar E-mail
loginRouter.get('/verifyEmail/:token', (req, res) => {
    const {token} = req.params

    User.findOne({tokenVerificacao: token})
    .then((usuario) => {
        if(!usuario){
            return res.status(400).send('Link de validação inválido ou expirado!')
        }
        usuario.emailVerificado = true
        usuario.tokenVerificacao = null

        return usuario.save()
    })
    .then(() => {
        res.send('email validado com sucesso!')
    }).catch((error) => {
        console.log(`erro: ${error}`)
        if(!res.hasHeader){
            res.status(500).send(`Erro ao validar e-mail ERRO: ${error}`)
        }  
    })
})

export default loginRouter