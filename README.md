# collab-notes-backend

Can set any PORT in a `.env` file. Default is 3001.

All routes send JSON containing the current user and either a document or a sucess/error message, depending on what is requested.


## ENDPOINTS

### NOTES

| Method | Endpoint | Input | Output |
|GET | --- | --- | --- |
|GET | /notes | na | all notes in DB |
|GET | /notes/:id | na | one note |
|GET | /notes/allby/:user | na | all notes created by user |
|GET | /notes/allshared/:user | na | all notes shared with user |
|POST | /notes | { title, ?text } | success if note created |
|DELETE | /notes/:id | na | success if note deleted |
|PUT | /notes/:id | {title, ?text } | success if note updated |
|PATCH | /notes/:id | {username, operation ('add' \| 'remove')} | success if note user added or removed from doc |
