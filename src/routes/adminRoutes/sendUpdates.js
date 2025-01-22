import { Router } from "express"
import nodemailer from "nodemailer"
import User from "../../models/User.js"
import dotenv from 'dotenv'
dotenv.config()
const sendRouter = Router()

//Rota para envio de informações de atualizações
sendRouter.get('/sendUpdate', (req, res) => {
    res.render('admin/updates')
})

//Processamento de dados do envio
sendRouter.post('/sendUpdate', (req, res) => {
    //Pegando os dados do formulário
    const {subject, message} = req.body

    //Buscando todos os emails registrados no sistema
    User.find({}, 'useremail')
    .then((users) => {
        //Preparando o transporte do email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        //Preparando os receptores do email
        for(const user of users){
            console.log(user.useremail)
            transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.useremail,
                subject: subject,
                text: message
            })
        }
    })
    .then(() => {
        req.flash('success_msg', 'E-mail enviado com sucesso!')
        res.redirect('/admin/dashboard')
    })
    .catch((error) => {
        req.flash('error_msg', 'Erro ao enviar email', error)
        res.redirect(req.headers.referer)
    })

})


export default sendRouter