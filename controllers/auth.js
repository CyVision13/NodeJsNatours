const User = require('./../models/userModel')
const jwt = require('jsonwebtoken')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

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

    const token = jwt.sign({id:newUser._id },process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
        status:'Success',
        token,
        data:{
            user: newUser
        }
    })
});


exports.login =catchAsync( async(req,res,next) =>{
    // const {email} = req.body;  ***** = const email = req.body.email;
    const {email, password} = req.body;
    
    // 1) Check if email and password exist
    if(!email || !password){
        return  next(new AppError('Please provide email and password',400));
    }

    // 2) Check if user exists && password is correct 
   const user =  await User.findOne({email }).select('+password') // email : email
    
    // 3) If everything ok, send token to client

    const token = '';
    res.status(200).json({
        status:"success",
        token
    })
    
})