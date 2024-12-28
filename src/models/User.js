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
    }
})

export default mongoose.model('User', User)