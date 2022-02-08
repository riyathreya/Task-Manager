const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description:{
        type: String, 
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,        
        ref: 'User'  //model name given for user model //providing reference for that user id to the user document 
    }
},{
    timestamps: true //this option automatically adds created at and updated at timestamps 
})


const Task = mongoose.model('task',taskSchema)
module.exports = Task;