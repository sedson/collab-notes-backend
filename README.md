# collab-notes-backend

Can set any PORT in a `.env` file. Defautl is 3001.

All routes send JSON containing the current user and either a document or a sucess/error message, depending on what is requested.


## ENDPOINTS

### NOTES

| Endpoint | Input | Output |
| --- | --- | --- | --- |
| /notes | na | all notes in DB |
| /notes/:id | na | one note |
| /notes/allby/:user | na | all notes created by user |
| /notes/allshared/:user | na | all notes shared with user |
| POST /notes | { title, ?text } | success if note created |
| DELETE /notes/:id | na | success if note deleted |
| PUT /notes/:id | {title, ?text } | success if note updated |
| PATCH /notes/:id | {username, operation ('add' | 'remove')} | success if note user added or removed from doc |
