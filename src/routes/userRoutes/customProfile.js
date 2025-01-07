import express from 'express'
const routerCustom = express.Router()
import upload from '../../config/multer.js'
// import multer from 'multer'
import User from '../../models/User.js'

//Rota para bio
  routerCustom.post('/home/bio', (req, res) => {
    const {biography, userId} = req.body
    //Pegando dados de formulário
    User.findByIdAndUpdate(userId, {biography})
    .then((bio) => {
      console.log(bio)
      req.flash('success_msg', 'Biografia atualizada!')
      res.redirect('/user/home')
    })
    .catch((error) => {
      console.log(error)
      req.flash('error_msg', 'Erro ao tentar atualizar biografia!')
      res.redirect('/user/home')
    })
  })

export default routerCustom