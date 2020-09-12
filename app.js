const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const app = express();

app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You Can post to this endpoint...');
// });

const getTour = (req, res) => {
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
const createTour = (req, res) => {
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

const getAllTours = (req, res) => {
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

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>',
    },
  });
};

// app.patch('/api/v1/tours/:id', updateTour);

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const tourRouter = express.Router();


tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);


  app.use('/api/v1/tours',tourRouter);
// app.delete('/api/v1/tours/:id', deleteTour);

const getAllUsers = (req,res){
  res.status(500).json({
    status:'error',
    message:'This route is not yet definded'
  })
}
const getUser = (req,res){
  res.status(500).json({
    status:'error',
    message:'This route is not yet definded'
  })
}
const createUser = (req,res){
  res.status(500).json({
    status:'error',
    message:'This route is not yet definded'
  })
}
const updateUser = (req,res){
  res.status(500).json({
    status:'error',
    message:'This route is not yet definded'
  })
}
const deleteUser = (req,res){
  res.status(500).json({
    status:'error',
    message:'This route is not yet definded'
  })
}
// ROUTES 



const userRouter = express.Router();


userRouter.route('/').get(getAllUsers).post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

  app.use('/api/v1/users',userRouter);

const port = 313;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
