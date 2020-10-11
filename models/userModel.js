const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],

    trim: true,
    maxlength: [20, 'A  name must have les or equal 20 characters'],
    minlength: [3, 'A  name must have les or equal 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'user must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
    select: false, //never will shown in results and password cant select automaticly
  },
  passwordConfirm: {
    type: String,
    required: [true, 'user must have a passwordConfirm'],
    validate: {
      // This only works on Carete & SAVE!!! we must switch from findOneAndUpdate with Save method to hash our passwords and use validator
      validator: function (el) {
        // we cant use arrow function cz we need to use This keyword !!!!
        return el === this.password;
      },
      message: 'Passwords Are Not The Same.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type: Boolean,
    default: true,
    select:false
  }
  // Confirm password must be the same as password
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 13);

  // Delete passwordConfirm Field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save',function(next){
  if(!this.isModified('password') || this.isNew ) return next();

  this.passworChagedAt = Date.now() - 1000; // for make sure server's delay get cought
  next();
})

userSchema.pre(/^find/,function(next){
  // this points to the current query
  this.find({active:{$ne:false}});
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password will not possible cz password is not available
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  // false means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({resetToken},this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60*1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
