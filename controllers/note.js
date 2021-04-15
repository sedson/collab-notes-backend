const express = require('express');
const router = express.Router();
const Note = require('../models/note');

module.exports = router;

// HELPERS –––––––––––––––––––––––––––––––––
const handleErr = (err, res) => {
  res.status(400).json({
    error: err.message,
    currentUser: req.session.currentUser || null
  })
}


// ALL NOTES –––––––––––––––––––––––––––––––
router.get('/', (req, res) => {
  Note.find({}).sort({'createdAt' : -1}).exec((err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})



// ALL NOTES FOR USER ––––––––––––––––––––––
router.get('/allby/:username', (req, res) => {
  Note.find({owner: req.params.username}).sort({'createdAt' : -1}).exec((err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})

// POST NOTE --------------------------------
router.post('/', (req, res) => {

  // if( ! req.session.currentUser) {
  //   res.status(400).json({
  //     message: "Must be logged in to create notes"
  //   })
  // }

  const newDrawing = {
    title: req.body.title || "untitled",
    text: req.body.text || "",
    owner: req.session.currentUser || "NONE",
    authorizedEditors: ["OPEN"],
    createdAt: Date.now(),
  }

  Note.create(newDrawing, (err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      message: "Note document created",
      currentUser: req.session.currentUser || null
    })
  })
})


// GET NOTE ––––––––––––––––––––––––––––––––
router.get('/:noteID', (req, res) => {
  Note.findById(req.params.id, (err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})
