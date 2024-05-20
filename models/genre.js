const Joi      = require('joi');
const mongoose = require('mongoose');

const gerneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    }
});

const Genre = mongoose.model('Genre', gerneSchema);

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).max(50).required()
    };

    return Joi.validate(genre, schema);
}

module.exports.Genre       = Genre;
module.exports.genreSchema = gerneSchema;
module.exports.validate    = validateGenre;
