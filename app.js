const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const AppError = require('./utils/appError');
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')



// 1) GLOBAL MIDDLEWARES

// Set Security HTTP headers
app.use(helmet())


// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs:60*60*1000,
  message: 'To many request from this IP, Please try again in an hour!' 
});

app.use('/api',limiter)



// Body Parser , reading data from body into req.body

app.use(express.json({limit: '10kb'}));


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());



// Data sanitization against XSS (prevent from put html code in inputs)
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration',
    'ratingAverage',
    'ratingsQuantity',
    'maxGroupSize',
    'difficulty',
    'price'

  ]
}));


// Serving Static files
app.use(express.static(`${__dirname}/public`));


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

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
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status:'fail',
  //   message:`Cant find ${req.originalUrl} on this server!`
  // })
  //// before implement AppError
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`)
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404)); // if next get parameters express knows that we have an err
});

app.use(globalErrorHandler);

// An Overview of Err Handling

module.exports = app;
