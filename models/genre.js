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
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });


    return schema.validate(genre);
}

module.exports.genreSchema = gerneSchema;
module.exports.Genre       = Genre;
module.exports.validate    = validateGenre;
