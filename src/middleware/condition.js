//Middleware de condição para o header de admin
const conditionHeader = (app) => {
    app.use((req, res, next) => {
        const noHeaderRoutes = [
            '/',
            '/user/home',
            '/user/post',
            '/user/contact',
            '/user/relevants',
        ];
    
        // Verifica se o caminho está na lista de rotas ou se corresponde ao padrão da rota dinâmica
        if (noHeaderRoutes.includes(req.path) || req.path.match(/^\/user\/searchPost\/.+$/)) {
            res.locals.showHeader = false;
        } else {
            res.locals.showHeader = true;
        }
    
        next();
    });
}

export default conditionHeader