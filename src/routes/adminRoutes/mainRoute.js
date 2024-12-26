import { Router } from 'express'
const adminRoute = Router()


//Rota para o dasboard
    adminRoute.get('/dashboard', (req, res) => {
        res.render('admin/dashboard')
    })

//Rota para o painel de gerenciamento de usuários
    adminRoute.get('/manageUsers', (req, res) => {
        res.render('admin/manageUsers')
    })

//Rota para o painel de gerenciamento de posts
    adminRoute.get('/managePosts', (req, res) => {
        res.render('admin/managePosts')
    })

//Rota para o painel de visão geral do sistema
    adminRoute.get('/generalVision', (req, res) => {
        res.render('admin/generalVision')
    })


export default adminRoute