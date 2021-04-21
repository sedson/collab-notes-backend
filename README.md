# collab-notes-backend

Can set any PORT in a `.env` file. Default is 3001.

All routes send JSON with this schema : 
```
{
  data: requested data or [],
  currentUser: stored session user or null
  message: success/error message or null
}
```


## ENDPOINTS

### NOTES

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
|GET | /notes | na | all notes in DB |
|GET | /notes/:id | na | one note |
|GET | /notes/allby/:user | na | all notes created by user |
|GET | /notes/allshared/:user | na | all notes shared with user |
|POST | /notes | { title, ?text } | success if note created |
|DELETE | /notes/:id | na | success if note deleted |
|PUT | /notes/:id | {title, ?text } | success if note updated |
|PATCH | /notes/:id | {username, operation : 'add' \| 'remove'} | success if note user added or removed from doc |
