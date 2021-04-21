const express = require('express');
const router = express.Router();
const User = require('../models/user.js')

module.exports = router;

// HELPERS –––––––––––––––––––––––––––––––––
const handleErr = (err, req, res) => {
  res.status(400).json({
    error: err.message,
    data: [],
    currentUser: req.session.currentUser || null
  })
}


router.get('/', (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      handleErr(err, req, res);
      return;
    }
    res.status(200).json({
      data: data,
    })
  })
})

router.post('/', (req, res) => {
  User.create(req.body, (err, data) => {
    if (err) {
      handleErr(err, req, res);
      return;
    }
    
    req.session.currentUser = data.username;
    res.status(200).json({
      message: "User created.",
      data: [],
      currentUser: data.username
    })
  })
})
