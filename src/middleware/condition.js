//Middleware de condição para o header de admin
const conditionHeader = (app) => {
    app.use((req, res, next) => {
        if(req.path === '/user/landingPage' || req.path === '/user/home'){
            res.locals.showHeader = true
        }
        else{
            res.locals.showHeader = false
        }
        next()
    })
}

export default conditionHeader