import { Router } from "express"
const resorcesRouter = Router()
import { isAuthenticated } from "../../config/auth.js"

resorcesRouter.get('/resources', isAuthenticated, (req, res) => {
    const nomeuser = req.user
    res.render('resourcesRoute/resources', {
        nomeuser: nomeuser
    })
})

//Rota da tela sobre
    resorcesRouter.get('/about', (req, res) => {
        const nomeuser = req.user
        res.render('resourcesRoute/about', {
            nomeuser: nomeuser
        })
    })

export default resorcesRouter