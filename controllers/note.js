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
    owner: req.session.currentUser || "none",
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
  Note.findById(req.params.noteID, (err, data) => {

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


// DELETE NOTE ––––––––––––––––––––––––––––––
router.delete('/:noteID', (req, res) => {
  Note.findByIdAndDelete(req.params.noteID, (err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      message: "Note successfully deleted.",
      currentUser: req.session.currentUser || null
    })
  })
})


// UPDATE NOTE –––––––––––––––––––––––––––––
router.put('/:noteID', (req, res) => {

  const updateDrawing = {
    title: req.body.title,
    text: req.body.text,
    editedAt: Date.now(),
  }


  Note.findByIdAndUpdate(req.params.noteID, updateDrawing, (err, data) => {

    if (err) {
      handleErr(err, res);
      return;
    }

    res.status(200).json({
      message: "Note successfully updated.",
      currentUser: req.session.currentUser || null
    })
  })
})

// ADD OR REMOVE COLLABORATOR ––––––––––––––
router.patch('/:noteID', (req, res) => {

  Note.findById(req.params.noteID, (err, data) => {

    // TODO: Could make this check to see if the user actually exists

    if (err) {
      handleErr(err, res);
      return;
    }

    // handle no operation
    if (! (req.body.operation === "add" || req.body.operation === "remove")) {
      res.status(400).json({
        message: "Please supply an operation: either 'add' or 'remove'",
        currentUser: req.session.currentUser || null
      });
      return;
    }

    // handle no username
    if (! req.body.username) {
      res.status(400).json({
        message: "Please supply a username",
        currentUser: req.session.currentUser || null
      });
      return;
    }

    // handle add user
    if (req.body.operation === "add") {

      data.authorizedEditors.push(req.body.username);

      data.save().then(() => {
        res.status(200).json({
          message: "Collaborator successfully added.",
          currentUser: req.session.currentUser || null
        })
      })
      return;
    }

    // handle remove user
    data.authorizedEditors = data.authorizedEditors.filter(x => x !== req.body.username);

    data.save().then(() => {
      res.status(200).json({
        message: "Collaborator successfully removed.",
        currentUser: req.session.currentUser || null
      })
    })
  })
})
