const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

module.exports = router;


router.get('/', (req, res) => {
  res.status(200).json({
    currentUser: req.session.currentUser || null
  })
})

router.delete('/', (req, res) => {
  req.session.destroy();
  req.session = null;
  res.status(200).json({
    message: 'User deleted',
    data: [],
    currentUser: null
  })
})

router.post('/', (req, res) => {

  User.findOne({username: req.body.username}, (err, user) => {

    if (err) {
      res.status(400).json({
        message: err.message,
        data: [],
        currentUser: rea.session.currentUser || null,
      })
      return;
    }

    if (! user) {
      res.status(400).json({
        message: "Username not found!",
        data: [],
        currentUser: null,
      })
      return;
    }

    if (req.body.password === user.password) {

      // actually log in
      req.session.currentUser = user.username;

      res.status(200).json({
        message: "Logged in!",
        data: [],
        currentUser: req.session.currentUser,
      })

    } else {

      req.session.currentUser = null;

      res.status(400).json({
        message: "Incorrect password!",
        data: [],
        currentUser: null,
      })
    }
  })
})
