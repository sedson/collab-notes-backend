// WEB SOCKETS –––––––––––––––––––––––––––––
const ws = require('ws');
const Note = require('./models/note.js');
const flatten = require('./utils/flattenSlateDoc.js')
const activeDocs = {};


// PARSE CONNECTION PARAMS –––––––––––––––––
// parses connection string and returns
// an object with matching params
// –––––––––––––––––––––––––––––––––––––––––
const parseConnectionParams = (url) => {
  const args = url.split('/').filter(x => x.length > 0);

  const urlParams = {};

  args.forEach(arg => {
    let param = arg.split('=');
    urlParams[param[0]] = param[1];
  })

  return urlParams;
}

// NEW CONNECTION ––––––––––––––––––––––––––
// creates a new connection between a
// a docmentID (room) an editorID (client)
// and the socket itself
// –––––––––––––––––––––––––––––––––––––––––
const connect = (docID, edID, socket) => {

  // make a new doc slot if needed
  if ( ! activeDocs[docID]) {
    activeDocs[docID] = {};
  }

  // put the editor socket in the document room
  if (! activeDocs[docID][edID]) {
    activeDocs[docID][edID] = socket;
  }
}


// CLOSE CONNECTION ––––––––––––––––––––––––
// iterate over the docs and remove the editor
// from any docs that it is inside of.
// if the doc is empty, delete it.
// –––––––––––––––––––––––––––––––––––––––––
const disconnect = (edID) => {
  Object.keys(activeDocs).forEach(docID => {
    delete activeDocs[docID][edID];

    if (Object.keys(activeDocs[docID]).length === 0) {
      delete activeDocs[docID];
    }
  })
}

// BROADCAST MESSAGE –––––––––––––––––––––––
// get the list of all sockets connected
// that are not the sender (edID) and
// broadcast the message
// –––––––––––––––––––––––––––––––––––––––––
const broadcast = (docID, edID, message) => {

  const broadcastList = Object.keys(activeDocs[docID]).filter(x => x !== edID);

  broadcastList.forEach(edID => {
    activeDocs[docID][edID].send(message);
  })
}


// SAVE DOC –––––––––––––––––––––––—————————
// push the most recent state of the doc
// into the db
// –––––––––––––––––––––––––––––––––––––––––
const pushDoc = (docID, newDocState, callback) => {

  const update = {
    content: JSON.stringify(newDocState),
    preview: flatten(newDocState),
    editedAt: Date.now()
  }

  Note.findByIdAndUpdate(docID, update, (err, data) => {
    callback(! err ? 'ok' : 'fail');
  })
}


// SERVER ––––––––––––––––––––––––––––––––––
const wsServer = new ws.Server({ noServer: true });

wsServer.on('connection', (socket, req) => {

  const { docID, edID } = parseConnectionParams(req.url);
  connect(docID, edID, socket);

  socket.on('close', () => {
    disconnect(edID);
  })

  socket.on('message', message => {
    const {editorID, newstate, ops} = JSON.parse(message).data;
    pushDoc(docID, newstate, () => null);
    broadcast(docID, edID, JSON.stringify({
      editorID: editorID,
      ops: ops
    }));
  });
});

module.exports = wsServer;
