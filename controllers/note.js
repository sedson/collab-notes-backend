const express = require('express');
const router = express.Router();
const Note = require('../models/note');

module.exports = router;

// HELPERS –––––––––––––––––––––––––––––––––
const handleErr = (err, req, res) => {
  if (err) {
    res.status(404).json({
      error: err.message,
      data: [],
      currentUser: req.session.currentUser || null
    })
    return true;
  }
  return false;
}


// ALL NOTES –––––––––––––––––––––––––––––––
router.get('/', (req, res) => {
  Note.find({}).sort({'createdAt' : -1}).exec((err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Success",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})


// ALL NOTES FOR USER ––––––––––––––––––––––
router.get('/allby/:username', (req, res) => {
  Note.find({owner: req.params.username}).sort({'createdAt' : -1}).exec((err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Success",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})

// ALL NOTES FOR USER ––––––––––––––––––––––
router.get('/allshared/:username', (req, res) => {
  Note.find({authorizedEditors: req.params.username}).sort({'createdAt' : -1}).exec((err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Success",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})

// POST NOTE --------------------------------
router.post('/', (req, res) => {

  if( ! req.session.currentUser) {
    res.status(401).json({
      message: "Must be logged in to create notes",
      data: [],
      currentUser: null
    })
    return;
  }

  console.log(req.session)

  const newNote = {
    title: req.body.title || "untitled",
    content: req.body.content || "",
    owner: req.session.currentUser || "none",
    authorizedEditors: ["OPEN"],
    createdAt: Date.now(),
  }

  Note.create(newNote, (err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Note document created",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})


// GET NOTE ––––––––––––––––––––––––––––––––
router.get('/:noteID', (req, res) => {
  Note.findById(req.params.noteID, (err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Success",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})


// DELETE NOTE ––––––––––––––––––––––––––––––
router.delete('/:noteID', (req, res) => {
  Note.findByIdAndDelete(req.params.noteID, (err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Note successfully deleted.",
      data: [],
      currentUser: req.session.currentUser || null
    })
  })
})


// UPDATE NOTE –––––––––––––––––––––––––––––
router.put('/:noteID', (req, res) => {

  const update = { editedAt: Date.now() };
  if (req.body.title) update.title = req.body.title;
  if (req.body.content) update.content = req.body.content;


  Note.findByIdAndUpdate(req.params.noteID, update, {new: true}, (err, data) => {

    if (handleErr(err, req, res)) return;

    res.status(200).json({
      message: "Note successfully updated.",
      data: data,
      currentUser: req.session.currentUser || null
    })
  })
})

// ADD OR REMOVE COLLABORATOR ––––––––––––––
router.patch('/:noteID', (req, res) => {

  Note.findById(req.params.noteID, (err, data) => {

    // TODO: Could make this check to see if the user actually exists

    if (handleErr(err, req, res)) return;

    // handle no operation
    if (! (req.body.operation === "add" || req.body.operation === "remove")) {
      res.status(400).json({
        message: "Please supply an operation: either 'add' or 'remove'",
        data: [],
        currentUser: req.session.currentUser || null
      });
      return;
    }

    // handle no username
    if (! req.body.username) {
      res.status(400).json({
        message: "Please supply a username",
        data: [],
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
          data: [],
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
        data: [],
        currentUser: req.session.currentUser || null
      })
    })
  })
})
