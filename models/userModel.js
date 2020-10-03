const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

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
        validate:{
            // This only works on Carete & SAVE!!! we must switch from findOneAndUpdate with Save method to hash our passwords and use validator
            validator : function(el) { // we cant use arrow function cz we need to use This keyword !!!!
                return el === this.password
            },
            message:"Passwords Are Not The Same."
        }
    }
    // Confirm password must be the same as password
})

userSchema.pre('save',async function(next){
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // hash the password with cost of 12
    this.password =await bcrypt.hash(this.password,13)

    // Delete passwordConfirm Field
    this.passwordConfirm = undefined ;
    next();
})



const User = mongoose.model('User', userSchema);

module.exports = User;
