import { Router } from "express";
const userRouter = Router()

//Rota de landing page
userRouter.get('/landingPage', (req, res) => {
    res.render('user/landingPage', {layout: 'main'})
})

//Rota de home page da aplicação
userRouter.get('/home', (req, res) => {
    res.render('user/home', {layout: 'main'})
})

export default userRouter