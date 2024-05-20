const {Rental, validate} = require('../models/rental');
const {Customer}         = require('../models/customer');
const {Movie}            = require('../models/movie');
const {Genre}            = require('../models/genre');
const express            = require('express');

const router = express.Router();

// handle CRUD operations for rental endpoints.

// [TODO]: handle rental dateReturned and rentalFee for a rental.

// create a new rental
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if(!customer)
        return res.status(404).send(`A customer with the given id:${req.body.customerId} is not found.`);

    const movie = await Movie.findById(req.body.movieId);
    if(!movie)
        return res.status(404).send(`A movie with the given id:${req.body.movieId} is not found.`);

    if(movie.numberInStock === 0)
        return res.status(400).send('Movie not in stock.');

    movie.numberInStock -= 1;
    movie.dailyRentalRate += 1;

    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },
        movie: {
            _id: movie._id,
            name: movie.name,
            genre: {
                _id: movie.genre._id,
                name: movie.genre.name
            },
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    // [TODO]: use two phase commit here...
    await rental.save();
    await movie.save();

    res.send(rental);
});

// get all rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// get specific rental
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if(!rental)
        return res.status(404).send(`A rental with the given id:${req.params.id} is not found.`);

    res.send(rental);
});

// update specific rental
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    
    const oldRental = await Rental.findById(req.params.id);
    if(!oldRental)
        return res.status(404).send(`A rental with the given id:${req.params.id} is not found.`);

    if(oldRental.movie._id !== req.body.movieId) {
        const oldMovie = await Movie.findByIdAndUpdate(oldRental.movie._id, {
            $inc: {numberInStock: 1}
        });
        if(!oldMovie)
            return res.status(404).send(`A movie with the given id:${oldRental.movie._id} is not found.`);
    }
    
    const customer = await Customer.findById(req.body.customerId);
    if(!customer)
        return res.status(404).send(`A customer with the given id:${req.body.customerId} is not found.`);

    const movie = await Movie.findById(req.body.movieId);
    if(!movie)
        return res.status(404).send(`A movie with the given id:${req.body.movieId} is not found.`);

    if(movie.numberInStock === 0)
        return res.status(400).send('Movie not in stock.');

    movie.numberInStock -= 1;
    movie.dailyRentalRate += 1;

    let rental = await Rental.findById(req.params.id);
    if(!rental)
        return res.status(404).send(`A rental with the given id:${req.params.id} is not found.`);

    rental.customer = {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold
    };
    rental.movie = {
        _id: movie._id,
        name: movie.name,
        genre: {
            _id: movie.genre._id,
            name: movie.genre.name
        },
        numberInStock: movie.numberInStock,
        dailyRentalRate: movie.dailyRentalRate
    };
    
    // [TODO]: use two phase commit here...
    await rental.save();
    await movie.save();

    res.send(rental);
});

// delete specific rental
router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if(!rental)
        return res.status(404).send(`A rental with the given id:${req.params.id} is not found.`);

    const movie = await Movie.findByIdAndUpdate(rental.movie._id, {
        $inc: {numberInStock: 1}
    });
    if(!movie)
        return res.status(404).send(`A movie with the given id:${rental.movie._id} is not found.`);

    res.send(rental);
});

module.exports = router;