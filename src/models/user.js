const { response } = require('express')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        required: true,
        trim: true,
        minlength: 7,
        type: String,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({}, process.env.JSON_WEBTOKEN_SECRET)
    console.log('token', token)

    user.tokens.concat({ token })
    user.save()
    
    return token
}

userSchema.methods.toJSON = async function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Undable to login!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
       throw new Error('Unable to login!') 
    }
}

// Hash the text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.passeord, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User