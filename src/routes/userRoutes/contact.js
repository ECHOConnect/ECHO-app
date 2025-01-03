import express, { text } from 'express'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const routerContact = express.Router()

//Configuração do nodemailer para envio do email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
//Rota para página de contato
    routerContact.get('/contact', (req, res) => {
         res.render('user/contact',{
            layout: 'main'
         })
    })

    routerContact.post('/contact', (req, res) => {
        //Pegando dados do form
        const {nome, email, mensagem} = req.body

        const mailOption = {
            from: email,
            to: process.env.EMAIL_USER,
            subject: `Novo feedback de ${nome}:`,
            text: `O que ele acha do nosso sistema?\n\n${mensagem}`
        }
        transporter.sendMail(mailOption)
        .then(() => {
           req.flash('success_msg', 'Mensagem enviada com sucesso!')
           res.redirect('/user/home')
        }).catch((error) => {
           console.log(error)
           req.flash('error_msg', 'Erro ao tentar enviar mensagem, tente novamente!')
           res.redirect('/user/home')
        })
    })


export default routerContact