# collab-notes-backend

## ENDPOINTS


```
GET /notes

returns {
  data: all notes in DB    
}
```

```
GET /notes/:noteID

returns {
  data: single note document    
}
```


```
GET /allby/username

returns {
  data: all notes created by username  
}
```

```
POST /notes

expects body {
    title: string,
    text: string,
}

returns {
    
}
```
