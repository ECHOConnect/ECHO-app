//Middleware de condição para o header de admin
const conditionHeader = (app) => {
    app.use((req, res, next) => {
        if(req.path === '/' || req.path === '/user/home' || req.path === '/user/post'){
            res.locals.showHeader = false
        }
        else{
            res.locals.showHeader = true
        }
        next()
    })
}

export default conditionHeader