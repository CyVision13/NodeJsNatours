const { query } = require('express');
// const fs = require('fs')
const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req , res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
}
class APIFeatures {
  constructor(query,queryString){
    this.query = query; // = mongo db query
    this.queryString = queryString; // = req.query
  }

  filter(){
    const queryObj = {...this.queryString}
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(el=> delete queryObj[el])
 
    // 2) Advanced query
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);



    this.query = this.query.find(JSON.parse(queryStr))
    // let query = Tour.find(JSON.parse(queryStr));

    return this; // entire Object

  }
  sort(){
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this; // entire Object
  }

  limitFields(){
    if(this.queryString.fields){
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }

    return this; // entire Object

  }

  paginate(){
    const page = this.queryString.page * 1 || 1 // converting to string with * 1
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)

    if(this.queryString.page){
      const numTours = await Tour.countDocuments();
 
      // throw err to immidiately go to Catch  Section
      if(skip>=numTours) throw new Error('This page does not exist')
    }

    return this;
  }
}
exports.getTour = async (req, res) => {
  try {
    const id = req.params.id;
    // const id = req.params.id * 1;
    const tour = await Tour.findById(id);
    // Tour.findOne({_id:req.params.id})
    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    // const newTours = new Tour({})
    // newTours.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

// app.post('/api/v1/tours', createTour);

exports.getAllTours = async (req, res) => {
  try {

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


    
// execute query

    const features = new APIFeatures(Tour.find(),req.query).filter().sort();

    const tours = await features.query
    // query.sort().select().skip().limit()


    res.status(200).json({
      status: 'seccess',
      results: tours.length,
      data: {
        // tours:tours
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail!',
      message: err,
    });
  }
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// app.patch('/api/v1/tours/:id', updateTour);

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id, {
      new: true,
      runValidators: true,
    });
    res.status(204).json({
      status: 'success',
      data: {
        tour: null,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
