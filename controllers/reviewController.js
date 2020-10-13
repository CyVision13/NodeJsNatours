const { query } = require('express');
// const fs = require('fs')
const catchAsync = require('./../utils/catchAsync')
const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeaturs');
const AppError = require('../utils/appError');




exports.getAllReviews = catchAsync(async (req,res,next)=>{
    

    const reviews = await Review.find();


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


    const newReview = await Review.create(req.body);
  
      res.status(201).json({
        status: 'success',
        data: {
          review: newReview,
        },
      });
  
  
   
  });