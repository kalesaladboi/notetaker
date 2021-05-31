const fs = require('fs');
const path = require('path');
const express = require('express');
const { notes } = require("./db/db.json");

const app = express();  

// parse string or array data
app.use(express.urlencoded({ extended: true }));

// parse JSON data
app.use(express.json());
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
});

app.post('/api/notes', (req, res) => {   
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formated.');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
    
});

function createNewNote(body, notesArray) {
    const note = body;
    note.id = Date.now();
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray}, null, 2)
    );

    return note;
}

function validateNote(note) {
    if(!note.title || typeof note.title !== 'string') {
        return false;
    }
    if(!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));