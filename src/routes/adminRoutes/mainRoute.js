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


export default adminRoute