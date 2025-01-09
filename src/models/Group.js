import mongoose from "mongoose"
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
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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