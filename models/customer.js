const Joi      = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    phone: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50
    },
    isGold: {
        type: Boolean,
        required: true,
        default: false
    }
}));

function validateCustomer(customer) {
    const schema = {
        name:   Joi.string().minLength(5).maxLength(50).required(),
        phone:  Joi.string().minLength(5).maxLength(50).required(),
        isGold: Joi.boolean().required()
    };

    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;