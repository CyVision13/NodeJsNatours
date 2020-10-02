const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        
        trim:true,
        maxlength:[20,'A  name must have les or equal 20 characters'],
        minlength:[3,'A  name must have les or equal 3 characters'],
        
      },
    email: {
        type: String ,
        required: [true, 'user must have email'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail,'Please provide a valid email']

    },
    photo: {
        type: String,
        
    },
    password: {
        type:String ,
        required:[true, 'user must have a password'],
        minlength: 8
    },
    passwordConfirm: {
        type:String ,
        required:[true, 'user must have a passwordConfirm'],

    }

    // Confirm password must be the same as password
})



const User = mongoose.model('User', userSchema);

module.exports = User;
