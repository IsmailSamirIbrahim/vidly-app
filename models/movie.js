const {genreSchema} = require('./genre');
const Joi           = require('joi');
const mongoose      = require('mongoose');

const movieSchema = new mongoose.Schema({
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
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        name:          Joi.string().min(5).max(50).required(),
        genreId:       Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(50).required()
    });

    return schema.validate(movie);
}

module.exports.movieSchema = movieSchema;
module.exports.Movie       = Movie;
module.exports.validate    = validateMovie;