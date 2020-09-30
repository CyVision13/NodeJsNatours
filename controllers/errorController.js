const AppError = require('./../utils/appError')
const handleCastErrorDB = err=>{
  const message = `Invalid ${err.path} : ${err.value}.`
  return new AppError(message,400)
}

const handleDuplicateFieldsDB = err =>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message,400)
}

const handleValidationErrorDB = err =>{
  const message = `Invalid input data.`;
  return new AppError(meesage,400)
}


const sendErrorDev = (err , res)=>{
  res.status(err.statusCode).json({
    status: err.status,
    error:err.status,
    message: err.message,
    stack:err.stack
  });
}

const sendErrorProd = (err,res)=>{ 
  
  if(err.isOperational) {
    res.status(err.statusCode).json({ 
      status: err.status,
      message: err.message,
      
    });
  } else {
    // 1) Log error 
    // console.error('ERROR ',err); 

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }

  

}

module.exports = (err, req, res, next) => {
    // express knows that middleware with 4 params is Err handling middleware!
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.Node_ENV ==='development'){

      sendErrorDev(err,res)
   

    } else if (process.env.Node_ENV ==='production'){

      let error = {...err}

      if(error.name ==='CastError') error =handleCastErrorDB(error);
      if(err.code === 11000) error = handleDuplicateFieldsDB(error)
      if(error.name ==='ValidationError') error = handleValidationErrorDB(error)

      sendErrorProd(error,res)
      
    } 
  
  }  