const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

module.exports = router;

router.post('/', (req, res) => {


  User.findOne({username: req.body.username}, (err, user) => {

    if (err) {
      res.status(400).json({
        message: err.message,
        currentUser: rea.session.currentUser || null,
      })
      return;
    }

    if (! user) {
      res.status(200).json({
        message: "NO USER IN SYSTEM",
        currentUser: null,
      })
      return;
    }

    if (req.body.password === user.password) {

      req.session.currentUser = user.username;

      
      res.status(200).json({
        message: "LOGGED IN",
        currentUser: user.username || null,
      })
    } else {
      req.session.currentUser = null;
      res.status(400).json({
        message: "BAD LOG IN",
        currentUser: null,
      })
    }
  })
})
