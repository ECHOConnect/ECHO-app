import multer from "multer"
import path from 'path'


//Configuração de armazamento dos documentos de imagem
const storage = multer.diskStorage({
    //Local de destino dos arquivos
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    //Pegando o nome original dos arquivos
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

//Filtro para os tipos de imagens
const fileFilter = (req, file, cb) => {
    const allowTypes = ['image/jpeh', 'image/png', 'image/gif', 'image/jpg']
    if(allowTypes.includes(file.mimetype)){
        cb(null, true)
    }
    else{
        cb(new Error('Tipo de arquivo não suportado'), false)
    }
}

const upload = multer({storage, fileFilter})
export default upload