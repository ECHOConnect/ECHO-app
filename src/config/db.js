//Importando o mongoose para as configurações
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
const dbUri = process.env.DB_URI

const appName = "echo_connect"

//Confuguração do mongoose para se conectar ao banco de dados
const configDB = () => {
    if(!dbUri){
        console.log('Variável de ambiente dburi não encontrada')
        return
    }
    mongoose.connect(dbUri)
    .then(() => {
        console.log(`Conectado ao mongoose, APP: ${appName}`)
    })
    .catch((error) => {
        console.log(`Erro ao se conectar ao mongoose erro: ${error}`)
    })
}

//Exportando configuração
export default configDB