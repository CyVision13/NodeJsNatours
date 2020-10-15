const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')


exports.getMe = (req,res,next) =>{
  req.params.id = req.user.id;
  next();
};

// catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   // Send Response
//   res.status(200).json({
//     status: 'seccess',
//     results: users.length,
//     data: {
//       // users:users
//       users,
//     },
//   });
// });



exports.updateMe = (req,res,next)=>{
  // 1) Create err if useer POSTs password data
  if(req.body.password || req.body.passwordConfirm){
    return next(AppError('This route is not for password update. Please  user /updateMyPassword.',400))
  }

  // 2) Update user document
  res.status(200).json({
    status: 'success'

  })
}


exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is notdefinded! Please use /signup instead',
  });
};


exports.deleteMe = catchAsync(async (req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active: false})


  res.status(204).json({
    status:'success',
    data:null
  })
})

exports.getUser = factory.getOne(User);

exports.getAllUsers = factory.getAll(User)

// Do NOT update password with this
exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User);
