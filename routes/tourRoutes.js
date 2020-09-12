const express = require('express');
const fs = require('fs');

const tourController= require('./../controllers/tourController')

const router = express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/:id').get(tourController.getTour).delete(tourController.deleteTour).patch(tourController.updateTour);

module.exports = router;
