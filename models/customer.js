const Joi      = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name:   Joi.string().min(5).max(50).required(),
        phone:  Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean().required()
    });

    return schema.validate(customer);
}

module.exports.customerSchema = customerSchema;
module.exports.Customer       = Customer;
module.exports.validate       = validateCustomer;