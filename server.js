require('dotenv').config();

const PORT = process.env.PORT || 3001;

// HTTP ––––––––––––––––––––––––––––––––––––
const http = require('http');

// EXPRESS –––––––––––––––––––––––––––––––––
const express = require('express');
const app = express();

// MONGOOSE ––––––––––––––––––––––––––––––––
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODBURI;
console.log(mongoURI);

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
const cors = require('cors');

const corsOptions = {
    "origin": ["http://localhost:3000", "https://collab-notes-front-end.herokuapp.com"],
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


// SERVER ––––––––––––––––––––––––––––––––––
const server = http.createServer(app);

server.listen(PORT, () =>{
  console.log(`Listening on http://localhost:${PORT}`)
})

// SOCKETS –––––––––––––––––––––––––––––––––
const wsServer = require('./socketserver.js');

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
