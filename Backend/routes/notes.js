const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Notes = require('../models/Notes');

//route1: get all the notes "/api/notes/fetchAllNotes" requires login
router.get('/fetchAllNotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

//route2: add the notes "/api/notes/addNotes" requires login
router.post('/addNotes', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

//route3: update the existing note "/api/notes/updateNotes" requires login
router.put('/updateNotes/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //create newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find note to be updated, then update
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

//route4: delete the existing notes "/api/notes/updateNotes" requires login
router.put('/deleteNotes/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        //find note to be deleted, then delete
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Not found");
        }
        //allow deletion if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "success": "Note deleted", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("error occured");
    }
})

module.exports = router