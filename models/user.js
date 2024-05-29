const Joi      = require('joi');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const config   = require('config');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        minLength: 15,
        maxLength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email:    Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required(),
        isAdmin:  Joi.boolean().required()
    });

    return schema.validate(user);
}

module.exports.User     = User;
module.exports.validate = validateUser;