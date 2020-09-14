const fs = require('fs')

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );
  
exports.checkID = (req,res,next,val)=>{
  console.log(`Tour id is : ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
}


exports.checkBody = (req,res,next)=>{
  if(!req.body.name || !req.body.price){
    return res.status(400).json({
      status:'fail',
      message:'Missing name or price'
    })
  }
  next();
}
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if(id > tours.length){
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'seccess',
    data: {
      tour,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// app.post('/api/v1/tours', createTour);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'seccess',
    results: tours.length,
    data: {
      // tours:tours
      tours,
    },
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
