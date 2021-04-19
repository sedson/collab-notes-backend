require('dotenv').config();

const PORT = process.env.PORT || 3001;

// EXPRESS –––––––––––––––––––––––––––––––––
const express = require('express');
const app = express();

// CORS ––––––––––––––––––––––––––––––––––––
const cors = require('cors');


// MONGOOSE ––––––––––––––––––––––––––––––––
const mongoose = require('mongoose');

const selectedDB = process.env.DB || 'collab-notes';
const mongoURI = 'mongodb://127.0.0.1:27017/' + selectedDB;

const mongooseOpts = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
};

mongoose.connect(mongoURI, mongooseOpts);

const db = mongoose.connection;

db.on('error', (err)=> { console.log('ERROR: ', err)});
db.on('connected', ()=> { console.log("mongo connected")});
db.on('disconnected', ()=> { console.log("mongo disconnected")});


// SESSION –––––––––––––––––––––––––––––––––
const session = require('express-session');

app.use(session({
  secret: process.env.SECRET || "a-really-bad-secret",
  resave: false,
  saveUninitialized: false
}));


// CORS ––––––––––––––––––––––––––––––––––––

const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,PUT,PATCH,POST,DELETE",
    "credentials" : true
}

app.use(cors(corsOptions));


// MIDDLEWARE ––––––––––––––––––––––––––––––
app.use(express.json());

app.use('/notes', require('./controllers/note.js'));
app.use('/users', require('./controllers/user.js'));
app.use('/sessions', require('./controllers/session.js'));


app.get('/', (req, res) => {
  res.json({
    message: "running"
  })
})


// LISTENER

app.listen(PORT, () =>{
  console.log(`Listening on http://localhost:${PORT}`)
})
