import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
const loginRouter = Router()

//Rota para fazer login
loginRouter.get('/login', (req, res) => {
    res.render('user/login', {layout: 'main-no-header-footer'})
})

loginRouter.post('/login', (req, res) => {
    // Pegando dados para autenticar login
    const { useremail, userpass } = req.body;
    console.log(useremail, userpass)

    // Verificando se os dados foram enviados
    if (!useremail || !userpass) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
    }

    // Procurando o usuário no banco de dados
    User.findOne({ useremail }).lean()
        .then((user) => {
            // Verificando se o usuário existe
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            // Comparando a senha
            bcrypt.compare(userpass, user.userpass)
                .then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Senha incorreta, tente novamente!' });
                    }

                    // Se a senha for válida, redirecionar para a página inicial do usuário
                    res.redirect('/user/home');
                })
                .catch((error) => {
                    console.log('Erro ao comparar a senha: ', error);
                    res.status(500).json({ message: 'Erro ao tentar autenticar a senha.' });
                });
        })
        .catch((error) => {
            console.log('Erro ao procurar o usuário: ', error);
            res.status(500).json({ message: 'Erro ao tentar buscar o usuário no banco de dados.' });
        });
});


//Rota para se cadastrar
loginRouter.get('/register', (req, res) => {
    res.render('user/register', {layout: 'main-no-header-footer'})
})

loginRouter.post('/register', (req, res) => {
    //Pegando dados do formulário de cadastro
   const {username, nameuser, useremail, userpass, birthdayuser} = req.body

   //Verificando se o email já existe 
   User.findOne({useremail})
   .then((user) => {
        if(user){
            res.set('e-mail já existe')
        }

        //Criptografando senha e salvando usuário
        const roundSalts = 10
        bcrypt.hash(userpass, roundSalts)
        .then((hashedPassword) => {
            const newUser = new User({
                username: username,
                nameuser: nameuser,
                useremail: useremail,
                userpass: hashedPassword,
                birthdayuser: birthdayuser
            })
            newUser.save()
            .then(() => {
                res.send('Registrado com sucesso!')
            }).catch((error) => {
                res.send('Erro ao tentar se registrar erro: ' + error)
            })
        }).catch((error) => {
            res.send('Erro ao gerar hash de senha erro: ' + error)
        })
   }).catch((error) => {
        res.send('Erro ao tentar buscar usuario')
   })
})

export default loginRouter