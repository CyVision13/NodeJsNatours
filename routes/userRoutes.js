const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/auth');
const reviewController = require('./../controllers/reviewController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


// *******this will protect all routes after this line********
router.use(authController.protect)



router.patch(
  '/updateMyPassword',
  authController.updatePassword
);


router.get(
  '/me',
  userController.getMe,
  userController.getUser)



router.patch('/updateMe',userController.updateMe)
router.delete('/deleteMe',userController.deleteMe)



// To get Access to Admins 
router.use(authController.restrictTo('admin'))


router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

  

module.exports = router;
