const express = require('express');
const fs = require('fs');

const tourController = require('./../controllers/tourController');

const router = express.Router();

// router.param('id',tourController.checkID);


//Create a checkBody middleware

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

module.exports = router;
