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
    console.error('ERROR ',err);

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

      sendErrorProd(err,res)
      
    }
  
  }