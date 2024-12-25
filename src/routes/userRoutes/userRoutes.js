import { Router } from "express";
const userRouter = Router()

//Rota de landing page
userRouter.get('/landingPage', (req, res) => {
    res.render('user/landingPage')
})

//Rota de home page da aplicação
userRouter.get('/home', (req, res) => {
    res.render('user/home')
})

export default userRouter