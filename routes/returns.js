const {Rental}         = require('../models/rental');
const {Movie}          = require('../models/movie');
const auth             = require('../middleware/auth');
const moment           = require('moment');
const express          = require('express');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    if(!req.body.customerId)
        return res.status(400).send('the customer with the given id is not found');
    if(!req.body.movieId)
        return res.status(400).send('the movie with the given id is not found');
    
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });

    if(!rental)
        return res.status(404).send('no rental found for this customer and movie id');

    if(rental.dateReturned)
        return res.status(400).send('the rental already processed');

    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.findByIdAndUpdate(rental.movie._id, {
        $inc: { numberInStock: 1 }
    });

    return res.status(200).send(rental);
});

module.exports = router;