import { Router } from "express"
import nodemailer from "nodemailer"
import User from "../../models/User.js"
import dotenv from 'dotenv'
dotenv.config()
const sendRouter = Router()

sendRouter.get('/sendUpdate', (req, res) => {
    res.render('admin/updates')
})

sendRouter.post('/sendUpdate', (req, res) => {
    const {subject, message} = req.body

    User.find({}, 'useremail')
    .then((users) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
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