//Middleware de condição para o header de admin
const conditionHeader = (app) => {
    app.use((req, res, next) => {
        const noHeaderRoutes = [
            '/',
            '/user/home',
            '/user/post',
            '/user/contact',
            '/user/relevants',
            '/user/home/searchUser',
            '/user/conections',
            '/user/createGroup',
            '/user/groupList',
            '/user/infoConections',
            '/user/Postgroup',
            '/user/explorerGroups'
        ]
    
        // Verifica se o caminho está na lista de rotas ou se corresponde ao padrão da rota dinâmica
        if (noHeaderRoutes.includes(req.path) || req.path.match(/^\/user\/searchPost\/.+$/) || req.path.match(/^\/user\/home\/searchUser\/.+$/) || req.path.match(/^\/user\/conections\/.+$/) || req.path.match(/^\/user\/infoConections\/.+$/) || req.path.match(/^\/user\/group\/.+$/) || req.path.match(/^\/user\/Postgroup\/.+$/) || req.path.match(/^\/user\/settings\/.+$/) || req.path.match(/^\/user\/groupTools\/.+$/)){
            res.locals.showHeader = false;
        } else {
            res.locals.showHeader = true;
        }
    
        next();
    });
}

export default conditionHeader