require('dotenv').config();

const PORT = process.env.PORT || 3001;

// EXPRESS –––––––––––––––––––––––––––––––––
const express = require('express');
const app = express();



// MONGOOSE ––––––––––––––––––––––––––––––––
const mongoose = require('mongoose');

const selectedDB = process.env.DB || 'collab-notes';
const mongoURI = 'mongodb://127.0.0.1:27017/' + selectedDB;

const mongooseOpts = {
  useFindAndModify: false,
  useNewUrlParser: true,
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
const whitelist = ['http://localhost:3000']

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'))
    }
  }
}


// MIDDLEWARE ––––––––––––––––––––––––––––––
app.use(express.json());

app.use('/notes', require('./controllers/note'))

app.get('/', (req, res) => {
  res.json({
    message: "running"
  })
})


// LISTENER

app.listen(PORT, () =>{
  console.log(`Listening on http://localhost:${PORT}`)
})
