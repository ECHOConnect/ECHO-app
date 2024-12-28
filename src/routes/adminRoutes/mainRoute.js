import { Router } from 'express'
const adminRoute = Router()
import { isAuthenticated ,isAdmin } from '../../config/auth.js'
import User from '../../models/User.js'


//Rota para o dasboard
    adminRoute.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
        User.find()
        .then((usuarios) => {
            res.render('admin/dashboard', {
                layout: 'main',
                usuarios:usuarios
            })
        })
        .catch()
    })

//Rota para o painel de gerenciamento de usuários
    adminRoute.get('/manageUsers', isAuthenticated, isAdmin, (req, res) => {
        res.render('admin/manageUsers', {layout: 'main'})
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