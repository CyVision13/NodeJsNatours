// const fs = require('fs')
const Tour = require('./../models/tourModel')





exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  
};
exports.createTour = async(req, res) => {

  // const newTours = new Tour({})
  // newTours.save()

   const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

// app.post('/api/v1/tours', createTour);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'seccess',
    // results: tours.length,
    // data: {
    //   // tours:tours
    //   tours,
    // },
  });
};

// app.get('/api/v1/tours', getAllTours);

// app.get('/api/v1/tours/:id', getTour);

exports.updateTour = (req, res) => {
  
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
};

// app.patch('/api/v1/tours/:id', updateTour);

exports.deleteTour = (req, res) => {
  
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
