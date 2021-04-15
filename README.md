# collab-notes-backend

## ENDPOINTS

#### GET /notes/:noteID
Returns:
```
data: single note document
```

#### GET /notes
Returns:
```
data: all notes in DB
```

#### GET /allby/username
Returns:
```
data: all notes created by username
```

#### GET /allby/username
Returns:
```
data: all notes created by username
```

#### POST /notes
Expects:
```
body {
    title: string,
    text: string,
}
```
