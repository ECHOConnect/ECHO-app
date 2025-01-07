import { Router } from "express"
const routeSearch = Router()
import User from "../../models/User.js"
import { isAuthenticated } from "../../config/auth.js"
import { populate } from "dotenv"


routeSearch.get('/home/searchUser', isAuthenticated,  (req, res) => {
    const query = req.query.q
    if(query == '' || typeof query == null || typeof query == undefined){
        req.flash('error_msg', 'Campo de pesquisa vazio')
        res.redirect('/user/home')
    }
    console.log(query)
    User.find({
        $or: [
            {nameuser: {$regex: query, $options: 'i'}},
            {username: {$regex: query, $options: 'i'}}
        ]
    }).select('nameuser username biography profilePicture ')
    .then((user) => {
        console.log(user)
        res.render('user/searchUser', {
            user: user,
            query: query,
            layout: 'main.handlebars'
        })
    })
    .catch((error) => {
        console.log('[debug]: erro: ', error)
    })
    

})


export default routeSearch