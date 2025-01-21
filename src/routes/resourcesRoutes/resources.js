import { Router } from "express"
const resorcesRouter = Router()

resorcesRouter.get('/resources', (req, res) => {
    const nomeuser = req.user
    res.render('resourcesRoute/resources', {
        nomeuser: nomeuser
    })
})


export default resorcesRouter