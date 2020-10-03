const User = require('./../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync')
exports.signup = catchAsync(async ( req,res,next)=>{
    // const newUser = await User.create(req.body) it had security issue
    // .create method with req.body will craete admin user in db and we dont need this
    // cz of it we need to let user fill the parameters that we need and use code like below
    const newUser = await User.create({
        name:req.body.name ,
        email:req.body.email,
        password: req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

   

    res.status(201).json({
        status:'Success',
        data:{
            user: newUser
        }
    })
});