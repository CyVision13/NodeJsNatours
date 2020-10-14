const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/auth')

// merging params to get params from another Routes like tourRoutes 
const router = express.Router({ mergeParams:true});

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'), 
        reviewController.setTourUserIds,
        reviewController.createReview
    )


router 
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)
module.exports = router;
