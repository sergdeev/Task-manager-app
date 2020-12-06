const mongoose = require('mongoose')
// const validator = require('validator')


const Task = mongoose.model('Task', {
    description: {
        trim: true,
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task