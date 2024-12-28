//Importando módulos
    import dotenv from 'dotenv'
    import express, { urlencoded } from 'express'
    import handlebars from 'express-handlebars'
    import { fileURLToPath } from 'url'
    import path from 'path'
    import mongoose from 'mongoose'
    import flash from 'connect-flash'
    const app = express()

//Importando rotas

    //Rotas de administradores
    import adminRoute from './routes/adminRoutes/mainRoute.js'

    //Rotas de usuários
    import userRouter from './routes/userRoutes/userRoutes.js'

    //Rota de login e cadastro
    import loginRouter from './routes/userRoutes/Login_register.js'

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
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')
        app.set('views', path.resolve('src', 'views'));

    //Config. de caminho padrão para pastas estáticas
        app.use(express.static(path.join(__dirname, '../public')))

    //Config. de conexão com o banco de dados
        mongoose.Promise = global.Promise
        configDB()

    //Middleware de condição de header
        conditionHeader(app)
        
//ROTAS
    //Rotas de administradores
        app.use('/admin', adminRoute)
    
    //Rotas de usuários
        app.use('/user', userRouter)

        app.use('/user', loginRouter)

//Conectando o servidor
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Conectado ao servidor na porta: ${PORT}`)
    })
