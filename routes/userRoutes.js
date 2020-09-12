const express = require('express');


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


  const router = express.Router();


  router.route('/').get(getAllUsers).post(createUser);
  router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);


    module.exports = router;