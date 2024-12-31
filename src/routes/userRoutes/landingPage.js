import express, { Router } from 'express'
const routerLanding = Router()

//Rota de landing page
routerLanding.get('/', (req, res) => {
    res.render('user/landingPage', {layout: 'main'})
})


export default routerLanding