const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You Can post to this endpoint...');
// });

// app.delete('/api/v1/tours/:id', deleteTour);

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req,res,next)=>{
  // res.status(404).json({
  //   status:'fail',
  //   message:`Cant find ${req.originalUrl} on this server!`
  // })
  const err = new Error(`Cant find ${req.originalUrl} on this server!`)
  err.status = 'fail';
  err.statusCode = 404;

  next(err); // if next get parameters express knows that we have an err
})


app.use((err,req,res,next)=>{ // express knows that middleware with 4 params is Err handling middleware!
  err.statusCode = err.statusCode || 500 ;
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    status : err.status,
    message: err.message
  })
})


// An Overview of Err Handling

module.exports = app;
