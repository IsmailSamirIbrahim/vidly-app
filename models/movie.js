const {genreSchema} = require('./genre');
const Joi           = require('joi');
const mongoose      = require('mongoose');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        trime: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 50
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 50
    }
}));

function validateMovie(movie) {
    const schema = {
        name:            Joi.string().minLenght(5).maxLength(50).required(),
        genreId:         Joi.string().minLenght(5).maxLength(50).required(),
        numberInStock:   Joi.number().min(0).max(50).required(),
        dailyRentalRate: Joi.number().min(0).max(50).required()
    };

    return Joi.validate(movie, schema);
}

module.exports.Movie    = Movie;
module.exports.validate = validateMovie;