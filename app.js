const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const app = express();

const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
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

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message:`Cant find ${req.originalUrl} on this server!`
  // })
  //// before implement AppError
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404;

  next(AppError(`Cant find ${req.originalUrl} on this server!`, 404)); // if next get parameters express knows that we have an err
});

app.use(globalErrorHandler);

// An Overview of Err Handling

module.exports = app;
