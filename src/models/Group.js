import mongoose, { mongo } from "mongoose"
const {Schema} = mongoose

const Groupschema = new Schema({
    nameGroup: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' 
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

const Group = mongoose.model('Group', Groupschema)
export default Group