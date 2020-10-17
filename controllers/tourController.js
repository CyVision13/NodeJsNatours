const { query } = require('express');
// const fs = require('fs')
const catchAsync = require('./../utils/catchAsync')
const Tour = require('./../models/tourModel');

const AppError = require('../utils/appError');
const factory = require('./handlerFactory')

exports.aliasTopTours = (req , res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
}



exports.getTour = factory.getOne(Tour,{path:'reviews'})

// catchAsync (async (req, res,next) => {
  
//   const id = req.params.id;
//   // const id = req.params.id * 1;
//   const tour = await Tour.findById(id)

//   if(!tour){
//     return next(new AppError('No tour found with that ID',404))
//   }

//   // Tour.findOne({_id:req.params.id})
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });

// });


exports.createTour = factory.createOne(Tour)

  // try {
  //   // const newTours = new Tour({})
  //   // newTours.save()

    
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
// });

// app.post('/api/v1/tours', createTour);

exports.getAllTours = factory.getAll(Tour);

// catchAsync( async (req, res,next) => {
  

//   // execute query
  
//       const features = new APIFeatures(Tour.find(),req.query).filter().sort().paginate();
  
//       const tours = await features.query
//       // query.sort().select().skip().limit()
  
  
//       res.status(200).json({
//         status: 'seccess',
//         results: tours.length,
//         data: {
//           // tours:tours
//           tours,
//         },
//       });
    
//   });

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);
///New Code
exports.updateTour = factory.updateOne(Tour)


//// Old Code
// catchAsync(  async (req, res,next) => {
 
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if(!tour){
//     return next(new AppError('No tour found with that ID',404))
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });

// });

// app.patch('/api/v1/tours/:id', updateTour);

exports.deleteTour = factory.deleteOne(Tour)

///// Old DeleteTour 
// exports.deleteTour = catchAsync (async (req, res,next) => {
 
//     const tour = await Tour.findByIdAndRemove(req.params.id, {
//       new: true,
//       runValidators: true,
//     });

//     if(!tour){
//       return next(new AppError('No tour found with that ID',404))
//     }
    
//     res.status(204).json({
//       status: 'success',
//       data: {
//         tour: null,
//       },
//     });
 
// });



exports.getTourStats = catchAsync(async (req,res,next)=>{
  
    const stats = await Tour.aggregate([
      {
        $match:{ratingAverage: { $gte:1}}
      },
      {
        $group : {
          // _id: '$difficulty',
          // _id: '$ratingAverage',
          _id: {$toUpper:'$difficulty'}, // divided by difficulty
          numTours:{$sum : 1 }, // computing each document = 1 number and summ all of them
          numRatings:{$sum:'$ratingsQuantity'},
          avgRating:{$avg:'$ratingAverage'},
          avgPrice:{ $avg:'$price'},
          minPrice:{$min:'$price'},
          maxPrice:{$max:'$price'},


        },
        
      },
      {
        $sort: {
          avgPrice:1
        }
      },
      // {
      //   $match: {_id:{$ne:'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      },
    });
  
})


exports.getTourWithin =catchAsync(  async(req,res,next)=>{
  const { distance, latlng, unit} = req.params;
  const [lat,lng] = latlng.split(',');
  const radius = unit ==='mi'? distance /3963.2 : distance / 6378.1;
  if(!lat || !lng){
    next(new AppError('Please provide latitutr and lonitude in the format lat,lng.',400))
  }

    // console.log(distance , lat , lng , unit);

    const tours = await Tour.find({ 
      startLocation:{
         $geoWithin : {$centerShpere: [[lng,lat], radius]}
        
        } 
      });

    res.status(200).jsno({
      status: 'success',
      results: tours.length,
      data : tours
    })
})

exports.getMonthlyPlan = catchAsync(async (req,res ,next) =>{

    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match:{
          startDates : {
            $gte : new Date(`${year}-01-01`),
            $lte : new Date(`${year}-12-30`)
          }
        }
      },{
        
        $group: {
          _id : { $month : '$startDates'},
          numTourStarts : { $sum : 1},
          tours: { $push : '$name'}
          
        }
      },
      {
        $addFields: {
          month : '$_id'
        }
      },
      {
        $project:{
          _id : 0
        }
      },
      {
        $sort: { 
          numTourStarts:-1
        }
      },
      {
        $limit : 12
      }
    ])


    res.status(200).json({
      status: 'success',
      data: {
        plan
      },
    });
  
})



/// OLD COdEs


 // first way of query
    // const tours = await Tour.find({
    //   duration:5,
    //   difficulty:'easy'
    // });

    // second way of query
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

  
    //third way of query 


    // to remove trash params in query like pagination and sort...
    //build query

    // 1) Filtering
    // const queryObj = {...req.query}
    // const excludedFields = ['page','sort','limit','fields'];
    // excludedFields.forEach(el=> delete queryObj[el])
 
    // // 2) Advanced query
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);




    // let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // if(req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   // console.log(sortBy);
    //   query = query.sort(sortBy)
    // } else {
    //   query = query.sort('-createdAt');
    // }


    // 3) Field limiting
    // if(req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields)
    // } else {
    //   query = query.select('-__v')
    // }


    // 4) Pagination
    // const page = req.query.page * 1 || 1 // converting to string with * 1
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit)

    // if(req.query.page){
    //   const numTours = await Tour.countDocuments();
 
    //   // throw err to immidiately go to Catch  Section
    //   if(skip>=numTours) throw new Error('This page does not exist')
    // }