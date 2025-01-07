//Importando módulos
    import dotenv from 'dotenv'
    import express, { urlencoded } from 'express'
    import handlebars from 'express-handlebars'
    import { fileURLToPath } from 'url'
    import path from 'path'
    import hbs from 'handlebars'
    import mongoose from 'mongoose'
    import flash from 'connect-flash'
    const app = express()
    import passport from 'passport'
    import { passportConfig } from './config/auth.js'
//Importando rotas

    //Rotas de administradores
        //Rota de painel de admin
            import adminRoute from './routes/adminRoutes/mainRoute.js'
        //Rota de forúm
            import forumRouter from './routes/adminRoutes/forumRoute.js'


    //Rotas de usuários
        //Rota de landing page
            import routerLanding from './routes/userRoutes/landingPage.js'
        //Rota da tela de home
            import userRouter from './routes/userRoutes/userRoutes.js'
        //Rota de login e cadastro
            import loginRouter from './routes/userRoutes/Login_register.js'
        //Rota de redefinição de senha
            import routeReset from './routes/userRoutes/resetPassword.js'
        //Rota de contato
            import routerContact from './routes/userRoutes/contact.js'
        //Rota de posts relevântes
            import relevantRouter from './routes/userRoutes/relevants.js'
        //Rota de edição de perfil
            import routerCustom from './routes/userRoutes/customProfile.js'
        //Rota de comentários em postagens
            import routeComments from './routes/userRoutes/comments.js'
        //Rota de busca de usuários
            import routeSearch from './routes/userRoutes/searchUser.js'
        //Rota upload para o drive
            import routerUpload from './routes/userRoutes/googleDrive.js'

//Importando configurações e middlewares

    //Acessando as configurações do dotenv
        dotenv.config()

    //Configuração do session
        import configSession from './config/session.js'
    
    //Configurações de conexão com o banco de dados
        import configDB from './config/db.js'
    
    //Middleware de condição de header
        import conditionHeader from './middleware/condition.js'

//Configurações

    //Config. de dirname e filename para uso de arquivos estáticos
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

    //Config. do session
        configSession(app)

    //Config. do passport
        passportConfig(passport)
        app.use(passport.initialize())
        app.use(passport.session())

    //Config. de variáveis globais e mensagens flash
        app.use(flash())

        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.User = req.user || null

            next()
        })

    //Config. de parser de json e dados de formulários
        app.use(express.json())
        app.use(urlencoded({extended: true}))
    
    //Config. do handlebars para páginas dinâmicas
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main', 
            runtimeOptions: {
                allowProtoPropertiesByDefault: true,
                allowProtoMethodsByDefault: true,
            }
        }))
        app.set('view engine', 'handlebars')
        app.set('views', path.resolve('src', 'views'));

    //Config. de caminho padrão para pastas estáticas
        app.use(express.static(path.join(__dirname, '../public')))

    //Config. de conexão com o banco de dados
        mongoose.Promise = global.Promise
        configDB()

    //Middleware de condição de header
        conditionHeader(app)
        
    //helper de condições complexas para o handlebars
    hbs.registerHelper('eq', function (a, b) {
        return a === b;
    });

//ROTAS
    //Rotas de administradores
        //Rotas de painel de admin
            app.use('/admin', adminRoute)
        //Rota de forúm
            app.use('/admin', forumRouter)
    
    //Rotas de usuários
        app.use('/', routerLanding)

        app.use('/user', userRouter)

        app.use('/user', loginRouter)

        app.use('/user', routeReset)

        app.use('/user', routerContact)

        app.use('/user', relevantRouter)

        app.use('/user', routerCustom)

        app.use('/user', routeComments)

        app.use('/user', routeSearch)

        app.use('/user', routerUpload)

//Conectando o servidor
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Conectado ao servidor na porta: ${PORT}`)
    })
