import express from 'express'
const routerCustom = express.Router()
import upload from '../../config/multer.js'
// import multer from 'multer'
import User from '../../models/User.js'
import Group from '../../models/Group.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
import { connect } from 'mongoose'

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

  //Rota para criação de grupo de estudos
    routerCustom.get('/createGroup', (req, res) => {
      const userId = req.user
      const nomeuser = req.user
      User.findById(userId)
      .populate('connections', 'nameuser profilePicture')
      .then((user) => {
        //Pegar as conexões e colocar no forms para adição
        const connect = user.connections
        res.render('user/createGroup', {
          connect: connect,
          nomeuser: nomeuser
        })
      
      })
      .catch((error) => {
        console.log('[debug]: Erro: ', error)
      })
  })

  //Rota de processamento de dados para a criação do grupo
    routerCustom.post('/createGroup/add', (req, res) => {
      //Pegando dados do formulário de criação do grupo
      const {nameGroup, description, status, members} = req.body
      //Id do usuário que criou o grupo
      const userId = req.user

      if(!nameGroup || !description || !Array.isArray(members)){
        req.flash('error_msg', 'Campos para criação do grupo em falta!')
        res.redirect('/user/home')
      }
      //Formatando dados de usuários
      const membersFormat = members.map((memberId) => ({
        user: memberId,
        role: 'member',
        email: memberId.useremail
      }))
      //Criador do grupo como admin
      membersFormat.push({
        user: userId,
        role: 'admin'
      })

      const newGroup = new Group({
        nameGroup: nameGroup,
        description: description,
        status: status,
        admin: userId,
        createdBy: userId,
        members: membersFormat
      })

      newGroup.save()
      .then((newGroupAdd) => {
        // Enviar emails individualmente para cada membro
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        // Enviar para cada membro do grupo (exceto o criador)
        newGroupAdd.members.forEach(async (member) => {
          if (member.user !== userId) { // Ignorar o criador
            // Pegar o email do membro
            const memberDetails = await User.findById(member.user);
            const memberEmail = memberDetails.useremail;
  
            if (memberEmail) {
              const mailOption = {
                from: process.env.EMAIL_USER,
                to: memberEmail,
                subject: `Adição em grupo de estudo`,
                text: `Olá, você foi adicionado ao grupo de estudos: ${newGroupAdd.nameGroup}. Aproveite!`,
              };
  
              // Enviar email
              transporter.sendMail(mailOption, (err) => {
                if (err) {
                  console.error(`[debug]: Erro ao enviar email para ${memberEmail}: ${err}`);
                } else {
                  console.log(`[debug]: Email enviado para ${memberEmail}`);
                }
              });
            }
          }  
        });
    
        req.flash('success_msg', 'Grupo criado com sucesso!');
        res.redirect('/user/groupList');
      })
      .catch((error) => {
        console.error('[debug]: Erro ao criar grupo: ', error);
        req.flash('error_msg', 'Houve um erro ao criar grupo, tente novamente');
        res.redirect(req.headers.referer);
      })
    })
  //Rota para acessar os grupos de estudos
    routerCustom.get('/groupList', (req, res) => {
      const nomeuser = req.user
      const userId = req.user
      Group.find({'members.user': userId})
      .populate('members.user', 'nameuser profilePicture')
      .populate('createdBy', 'nameuser profilePicture')
      .sort({createdDate: -1})
      .then((groups) => {
        res.render('user/groupList', {
          nomeuser: nomeuser,
          groups: groups,
        })
      })
    })

  //Rota para informação de usuários
    routerCustom.get('/infoConections/:id', (req, res) => {
      const connectId = req.params.id
      const nomeuser = req.user
      User.findById(connectId)
      .populate('connections', 'nameuser profilePicture')
      .then((user) => {
        const userConnect = user.connections
        res.render('user/infoConections', {
          user: user,
          nomeuser: nomeuser,
          userConnect: userConnect
        })
      })
      .catch((error) => {
        console.log('[debug]: Erro: ', error)
      })
      
    })

export default routerCustom