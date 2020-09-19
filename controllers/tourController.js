// const fs = require('fs')
const Tour = require('./../models/tourModel')





exports.getTour =async (req, res) => {
  try {
    const id = req.params.id ;
    // const id = req.params.id * 1;
    const tour = await Tour.findById(id)
    // Tour.findOne({_id:req.params.id})
    res.status(201).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
  

  
};
exports.createTour = async(req, res) => {
  try{
    // const newTours = new Tour({})
  // newTours.save()

   const newTour = await Tour.create(req.body)

   res.status(201).json({
     status: 'success',
     data: {
       tour: newTour,
     },
   });

  } catch (err){
    res.status(400).json({
      status:"fail",
      message:err
    })
  }
  
};

// app.post('/api/v1/tours', createTour);

exports.getAllTours = async(req, res) => {
  try{
    const tours = await Tour.find();
  res.status(200).json({
    status: 'seccess',
    results: tours.length,
    data: {
      // tours:tours
      tours,
    },
  });
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

exports.updateTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new : true,
      runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
  
};

// app.patch('/api/v1/tours/:id', updateTour);

exports.deleteTour = async(req, res) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id,{
      new : true,
      runValidators:true
    })
    res.status(204).json({
      status: 'success',
      data: {
        tour :null
      },
    });
  } catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
  
};
