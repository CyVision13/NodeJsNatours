const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Send Response
  res.status(200).json({
    status: 'seccess',
    results: users.length,
    data: {
      // users:users
      users,
    },
  });
});

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

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet definded',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet definded',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet definded',
  });
};

exports.deleteMe = catchAsync(async (req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active: false})


  res.status(204).json({
    status:'success',
    data:null
  })
})


exports.deleteUser = factory.deleteOne(User);
