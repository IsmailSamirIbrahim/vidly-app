const {Rental} = require('../models/rental');
const {Movie}  = require('../models/movie');
const auth     = require('../middleware/auth');
const validate = require('../middleware/validate');
const moment   = require('moment');
const Joi      = require('joi');
const express  = require('express');

const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
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

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId:    Joi.objectId().required(),
    });

    return schema.validate(req);
}

module.exports = router;