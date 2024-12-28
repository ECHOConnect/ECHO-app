//Middleware de condição para o header de admin
const conditionHeader = (app) => {
    app.use((req, res, next) => {
        if(req.path === '/user/landingPage' || req.path === '/user/home' || req.path === '/user/login'){
            res.locals.showHeader = true
            res.locals.showFooter = true
        }
        else{
            res.locals.showHeader = false
            res.locals.showFooter = false
        }
        next()
    })
}


export default conditionHeader