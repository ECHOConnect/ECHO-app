import mongoose from "mongoose"
const { Schema } = mongoose

const PostProject = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'ia', 'other'],
        default: 'web',
        required: true
    },
    tecnologies: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['in progress', 'completed', 'paused'],
        default: 'in progress'
    },
    repository: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(v);
            },
            message: props => `${props.value} não é uma URL válida!`
        }
    },
    collaborators: {
        type: [String]
    },
    tags: {
        type: [String]
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        content: {type: String, required: true},
        createdDate: {type: Date, default: Date.now}
    }]
})

export default mongoose.model('Project', PostProject)