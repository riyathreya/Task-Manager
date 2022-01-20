const mongoose = require('mongoose');

const Task = mongoose.model('task', {
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
})

module.exports = Task;