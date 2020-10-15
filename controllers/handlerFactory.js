const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError');
// const { query } = require('express');
const APIFeatures = require('./../utils/apiFeaturs');

exports.deleteOne = Model =>catchAsync (async (req, res,next) => {
 
    const doc = await Model.findByIdAndRemove(req.params.id, {
      new: true,
      runValidators: true,
    });

    if(!doc){
      return next(new AppError('No document found with that ID',404))
    }
    
    res.status(204).json({
      status: 'success',
      data: {
        data: null,
      },
    });
 
});


exports.updateOne = Model => catchAsync(  async (req, res,next) => {
 
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!doc){
      return next(new AppError('No document found with that ID',404))
    }
    res.status(200).json({
      status: 'success',
      data: {
        data:doc,
      },
    });

});

exports.createOne = Model => catchAsync(async (req, res, next) => {


    const doc = await Model.create(req.body);
  
      res.status(201).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
})

exports.getOne = (Model,popOptions) => catchAsync (async (req, res,next) => {
  
    const id = req.params.id;
    // const id = req.params.id * 1;
    let query = Model.findById(id)
    if(popOptions)  query = query.populate(popOptions)

    const doc = await query

    if(!doc){
      return next(new AppError('No document found with that ID',404))
    }

    // doc.findOne({_id:req.params.id})
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  
});

exports.getAll = Model =>  catchAsync( async (req, res,next) => {
  
    // To allow for nested GET reviews on tour ( small hack)
    let filter = {}
    if(req.params.tourId) filter = {tour:req.params.tourId}


    // execute query
    
        const features = new APIFeatures(Model.find(filter),req.query).filter().sort().paginate();
    
        const doc = await features.query.explain()
        // query.sort().select().skip().limit()
    
    
        res.status(200).json({
          status: 'seccess',
          results: doc.length,
          data: {
            // doc:doc
            data: doc,
          },
        });
      
    });


