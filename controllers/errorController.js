module.exports = (err, req, res, next) => {
    // express knows that middleware with 4 params is Err handling middleware!
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }