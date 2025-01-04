import mongoose from "mongoose";
const {Schema} = mongoose

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    nameuser: {
        type: String,
        required: true
    },
    useremail: {
        type: String,
        required: true
    },
    userpass: {
        type: String,
        required: true
    },
    birthdayuser: {
        type: Date,
        required: true
    },
    role:{
        type: String,
        enum: ['SUPER_ADMIN','admin', 'user'],
        default: 'user'
    },
    tokenVerificacao: {
        type: String
    },
    emailVerificado: {
        type: Boolean,
        default: false
    },
    tokenVerificado: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    },
    profilePicture: {
        type: String,
        default: '/uploads/default-profile.png'
    }
})

export default mongoose.model('User', User)