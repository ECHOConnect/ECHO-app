import { google } from 'googleapis';
import express, { response } from 'express';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import multer from 'multer';
import User from '../../models/User.js';

const routerUpload = express.Router();

const google_api_folder = '17Iqav0qyebGtIUB61zlq6HR0kR9-lFn2'

// Configuração do multer para o upload de arquivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

// Configuração do cliente do Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(path.resolve(), 'src', 'echoapp.json'), // Caminho para o arquivo JSON
    scopes: SCOPES,
});
const drive = google.drive({
    version: 'v3',
    auth,
});

// Função para converter buffer em um stream
function bufferToStream(buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // Indica o final do stream
    return readable;
}

// Rota para mudança de foto de perfil
routerUpload.post('/home/:userId', upload.single('profilePhoto'), async (req, res) => {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
        req.flash('erro_msg', 'Nenhum arquivo foi enviado');
        return res.redirect('/user/home');
    }

    try {
        const fileName = `profile-photo-${userId}`;

        // Verificar se o usuário já possui uma foto de perfil no Drive
        const searchResponse = await drive.files.list({
            q: `name='${fileName}' and trashed=false`,
            fields: 'files(id, name)',
        });

        // Se encontrar uma foto existente, excluí-la
        if (searchResponse.data.files.length > 0) {
            const fileId = searchResponse.data.files[0].id;
            await drive.files.delete({ fileId });
        }

        const fileMetadata = {
            name: fileName,
            parents: [google_api_folder],
        };

        const media = {
            mimeType: file.mimetype,
            body: bufferToStream(file.buffer),
        };
        const uploadResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });
        // Tornando o arquivo público para visualização
        await drive.permissions.create({
            fileId: uploadResponse.data.id,
            requestBody: {
                role: 'reader', // Permissão de leitura
                type: 'anyone', // Permite que qualquer pessoa com o link acesse
            },
        });

        const fileId = uploadResponse.data.id
        console.log(fileId)
        // Atualizar o link no banco de dados
        const newPhotoLink = `https://drive.google.com/uc?export=view&id=${fileId}`

        await User.findByIdAndUpdate(userId, { profilePicture: fileId });

        // Retornar sucesso e o link atualizado
        req.flash('success_msg', 'Foto de perfil atualizada com sucesso!')
        res.redirect('/user/home')
    } catch (error) {
        console.error('Erro ao atualizar a foto de perfil:', error);
        res.status(500).send('Erro ao atualizar a foto de perfil.');
    }
});

routerUpload.get('/home/:userId', (req, res) => {
    const { userId }  = req.params
    res.render('user/home', {
        userId
    })
})

export default routerUpload;