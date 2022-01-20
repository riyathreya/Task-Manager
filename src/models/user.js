const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error("Age must be a positive number");
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email Invlaid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password included in password! Invalid');
            }
        }
    },
    tokens: [{ //this will be an array of objects
        token:{
            type: String,
            required: true
        }
    }]
});

//defines virtual relation, this field is not stored in db document
//just indicates that this new field tasks is related to the Task collection
userSchema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})

//mongoose middlewares can be applied on schema  => schemaName.pre , schemaName.post for before and after an event (here, save is the event)
//don't use arrow functions as they cannot bind this, we need this to access the object being saved

// hash the plain text password before saving, when things are called internally by events(like the save event), 
//it is our responsibility to tell node to execute next() part once this current code exec is complete 
userSchema.pre('save', async function(next){
    
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }


    next(); // call next once this execution is complete 
})

//create a custom fuction on userschema 
//defining the function on schemaname.statics allows you to use the function directly on the model


//statics methods are accessible on model, aslso called model methods (called like User.findbyCredentials())
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error("Unable to find user!")
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("Unable to login!")
    }
    return user;
}

//methods on schema are accessible on instances, called instance methods (called like user.generateAuthToken()))
userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({ _id: this._id.toString() }, 'thisismynewcourse'); //generating the token by using unique id and signing with a string
    this.tokens = this.tokens.concat({ token })   //adding the new token to the token array for that user

    await this.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject
}

//Create model
const User = mongoose.model('User', userSchema)


module.exports = User;