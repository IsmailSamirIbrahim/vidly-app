const {customerSchema} = require('./customer');
const {movieSchema}    = require('./movie');
const Joi              = require('joi');
const mongoose         = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true
    },
    movie: {
        type: movieSchema,
        required: true
    },
    dataOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0
    }
}));

function validateRental(rental) {
    const schema = {
        customerId: Joi.string().min(5).max(50).required(),
        movieId: Joi.string().min(5).max(50).required(),
    };

    return Joi.validate(rental, schema);
}

module.exports.Rental   = Rental;
module.exports.validate = validateRental;