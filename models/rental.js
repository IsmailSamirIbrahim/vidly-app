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
    dateOut: {
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
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId:    Joi.objectId().required(),
    });

    return schema.validate(rental);
}

module.exports.Rental   = Rental;
module.exports.validate = validateRental;