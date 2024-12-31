import { Router } from "express";
const userRouter = Router()
import User from "../../models/User.js";

//Rota de home page da aplicação
userRouter.get('/home', (req, res) => {
    const nomeuser = req.user
    res.render('user/home', {layout: 'main', nomeuser: nomeuser})
})

export default userRouter