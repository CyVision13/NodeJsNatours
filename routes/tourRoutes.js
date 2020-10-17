const express = require('express');
const fs = require('fs');
const authController = require('./../controllers/auth')

const tourController = require('./../controllers/tourController');
const reviewRouter = require('./../routes/reviewRoutes')
const router = express.Router();

  
// router old code
  //   .route('/:tourId/reviews')
  //   .post(
  //     authController.protect,
  //     authController.restrictTo('user'),
  //     reviewController.createReview
  //     )
// router new code Express Nested Routes
  router.use('/:tourId/reviews',authController.protect,reviewRouter)




// router.param('id',tourController.checkID);

//Create a checkBody middleware

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tours-within/:distance/center/:latlng/:unit').get(tourController.getTourWithin)


router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,
    authController.restrictTo('admin','lead-guide') ,
    tourController.createTour);
  

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year')
.get(authController.protect,authController.restrictTo('admin','lead-guide','guide') ,tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide') ,tourController.deleteTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide') ,tourController.updateTour);




  


module.exports = router;
