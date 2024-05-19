const {Genre, validate} = require('../models/genre');
const express           = require('express');

const router = express.Router();

// handle CRUD operations for genre object.

// create a new genre
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });
    await genre.save();

    res.send(genre);
});

// get all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

// get specific genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(genre === undefined)
        res.status(404).send(`The genre with the given id:${req.params.id} not found.`);
    
    res.send(genre);
});

// update specific genre
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if(genre === undefined)
        res.status(404).send(`The genre with the given id:${req.params.id} not found.`);

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if(genre === undefined)
        res.status(404).send(`The genre with the given id:${req.params.id} not found.`);
    
    res.send(genre);
});

module.exports = router;