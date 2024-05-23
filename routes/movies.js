const {Movie,  validate} = require('../models/movie');
const {Genre}            = require('../models/genre');
const auth               = require('../middleware/auth');
const admin              = require('../middleware/admin');
const asyncMiddleware    = require('../middleware/async');
const express            = require('express');

const router = express.Router();

// handle CRUD operations for movie endpoints.

// create a new movie
router.post('/', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre)
        res.status(404).send(`The genre with the given id:${req.body.genreId} not found.`);

    const movie = new Movie({
        name: req.body.name,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();

    res.send(movie);
}));

// get all movies
router.get('/', asyncMiddleware(async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
}));

// get specific movie
router.get('/:id', asyncMiddleware(async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if(!movie)
        res.status(404).send(`The movie with the given id:${req.params.id} not found.`);

    res.send(movie);
}));

// update specific movie
router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre)
        res.status(404).send(`The genre with the given id:${req.body.genreId} not found.`);

    const movie = await Movie.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            genre:{
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, {new: true});
    if(!movie)
        res.status(404).send(`The movie with the given id:${req.params.id} not found.`);

    res.send(movie);
}));

// delete specific movie
router.delete('/:id', [auth, admin], asyncMiddleware(async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if(!movie)
        res.status(404).send(`The movie with the given id:${req.params.id} not found.`);

    res.send(movie);
}));

module.exports = router;