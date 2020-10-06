const express = require('express');
const fs = require('fs');
const authController = require('./../controllers/auth')

const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id',tourController.checkID);

//Create a checkBody middleware

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect ,tourController.getAllTours)
  .post(tourController.createTour);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide') ,tourController.updateTour);

module.exports = router;
