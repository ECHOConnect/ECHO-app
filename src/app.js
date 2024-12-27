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

//Importando rotas

    //Rotas de administradores
        //Rota de painel de admin
            import adminRoute from './routes/adminRoutes/mainRoute.js'
        //Rota de forúm
            import forumRouter from './routes/adminRoutes/forumRoute.js'


    //Rotas de usuários
    import userRouter from './routes/userRoutes/userRoutes.js'

//Importando configurações

    //Acessando as configurações do dotenv
        dotenv.config()

    //Configuração do session
        import configSession from './config/session.js'
    
    //Configurações de conexão com o banco de dados
        import configDB from './config/db.js'

//Configurações

    //Config. de dirname e filename para uso de arquivos estáticos
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = path.dirname(__filename)

    //Config. do session
        configSession(app)

    //Config. de variáveis globais e mensagens flash
        app.use(flash())

        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')

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

    //helper de condições complexas para o handlebars
    hbs.registerHelper('eq', function (a, b) {
        return a.toString() === b.toString();
    });

//ROTAS
    //Rotas de administradores
        //Rotas de painel de admin
            app.use('/admin', adminRoute)
        //Rota de forúm
            app.use('/admin', forumRouter)
    
    //Rotas de usuários
        app.use('/user', userRouter)

//Conectando o servidor
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Conectado ao servidor na porta: ${PORT}`)
    })
