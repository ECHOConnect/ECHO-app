import express from 'express'
const routerCustom = express.Router()
import upload from '../../config/multer.js'
import User from '../../models/User.js'

routerCustom.post('/home', upload.single('profileImage'), (req, res) => {
    if(!req.file){
        req.flash('error_msg', 'Por favor, insira uma imagem válida')
        res.redirect('/user/home')
    }
    const filePath = `/uploads/${req.file.filename}`
    User.findByIdAndUpdate(req.user.id, { profilePicture: filePath }, { new: true })
    .then((user) => {
      res.status(200).json({ message: 'Foto de perfil atualizada com sucesso!', user });
      console.log(user)
    })
    .catch((error) => {
      res.status(500).json({ error: 'Erro ao atualizar a foto de perfil.' });
    });
})


export default routerCustom