import { Router } from "express"
import Post_Project from "../../models/Post_Project.js"

const routeProjects = Router()

routeProjects.get('/postProject', (req, res) => {
    const nomeuser = req.user
    
    res.render('resourcesRoute/postProject', {
        nomeuser: nomeuser
    })
})

routeProjects.post('/postProject', (req, res) => {
    //Pegando dados do formulário
    const {
        author,
        title,
        description, 
        category, 
        tecnologies, 
        status, 
        repository,
        collaborators,
        tags
    } = req.body

    if(!title || !category || !description){
        req.flash('error_msg', 'Campos obrigatórios não preechidos ou inválidos')
        res.redirect(req.headers.referer)
    }

    //Separando os arrays por vírgulas e convertendo para minúsculas
    const tagsArray = tags 
    ? tags.toLowerCase()
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag !== '')
    : []

    const collaboratorsArray = collaborators 
    ? collaborators.split(',').map((col) => col.trim())
    : [];

    const tecnologiesArray = tecnologies 
    ? tecnologies.split(',').map((tech) => tech.trim())
    : [];

    //Salvando dados no banco de dados
    const newPost = new Post_Project({
        author: author,
        title: title,
        description: description,
        category: category,
        tecnologies: tecnologiesArray,
        status: status,
        repository: repository,
        collaborators: collaboratorsArray,
        tags: tagsArray
    })

    newPost.save()
    .then(() => {
        console.log('Postagem feita com sucesso!')
        req.flash('success_msg', 'Postagem feita com sucesso!')
        res.redirect('/user/home')
    })
    .catch((error) => {
        console.log(error)
        req.flash('error_msg', 'Erro ao fazer postagem!')
        res.redirect(req.headers.referer)
    })
})

routeProjects.get('/projects', (req, res) => {
    const nomeuser = req.user
    Post_Project.find()
    .populate('author', 'nameuser profilePicture')
    .then((project) => {
        const projectWithPreview = project.map((project) => ({
            ...project._doc,
            prevDescription: project.description.slice(0, 40)
        }))
        res.render('resourcesRoute/projects', {
            nomeuser: nomeuser,
            project: projectWithPreview,
        })
    })
})


export default routeProjects