import { Router } from "express"
const resorcesRouter = Router()
import { isAuthenticated } from "../../config/auth.js"

resorcesRouter.get('/resources', isAuthenticated, (req, res) => {
    const nomeuser = req.user
    res.render('resourcesRoute/resources', {
        nomeuser: nomeuser
    })
})


export default resorcesRouter