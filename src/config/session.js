//Importando o session para as configurações
import session from 'express-session'

//Configuração e exportação do session
const configSession = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {secure: false}
    }))
}

//Exportando cofiguração
export default configSession
