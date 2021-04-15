# collab-notes-backend

Can set any PORT in a `.env` file. Defautl is 3001.

All routes send JSON containing the current user and either a document or a sucess/error message, depending on what is requested.


## ENDPOINTS

### NOTES

#### Get all notes in DB
```
GET /notes
returns {
  data: all notes in DB    
}
```

#### Get a single note
```
GET /notes/:noteID

returns {
  data: single note document    
}
```

#### Get all of a user's owned notes
```
GET /allby/:username

returns {
  data: all notes created by username  
}
```

#### Get all notes that a user shares
```
GET /allshared/:username

returns {
  data: all notes created by username  
}
```

#### Create a note
```
POST /notes

expects body {
    title: string,
    text: string,
}

returns {
  message
}
```

#### Delete a note
```
DELETE /notes/:nodeID

returns {
  message
}
```

#### Update a note
```
PUT /notes/:noteID

expects body {
  title: string
  text: string
}

returns {
  message
}

```

#### Add or remove a collaborator from a note
```
PATCH /notes/:noteID

expects body {
  username: string
  operation: string – either "add" or "remove"
}

returns {
  message
}

```
