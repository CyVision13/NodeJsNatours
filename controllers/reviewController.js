const { query } = require('express');
// const fs = require('fs')
const catchAsync = require('./../utils/catchAsync')
const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeaturs');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory')


exports.getAllReviews = catchAsync(async (req,res,next)=>{
  let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}

    const reviews = await Review.find(filter);


      res.status(201).json({
        status: 'success',
        result:reviews.length,
        data: {
          reviews,
        },
      });
})
exports.getReview = catchAsync(async (req,res,next)=>{
    const id = req.params.id;

    const review = await Review.findById(id);

    if(!review){
        return next(new AppError('No tour found with that ID',404))
      }

      res.status(201).json({
        status: 'success',
        data: {
          review,
        },
      });
})


exports.createReview = catchAsync(async (req, res, next) => {

  // Allow nested routes
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id; // we will get req.user from protect middleware 

    const newReview = await Review.create(req.body);
  
      res.status(201).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
  
  
   
  });

  exports.deleteReview = factory.deleteOne(Review)