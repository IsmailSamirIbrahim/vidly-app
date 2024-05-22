const {User}  = require('../models/user');
const bcrypt   = require('bcrypt');
const Joi     = require('joi');
const express = require('express');

const router = express.Router();

// handle the user login with the given email and password.
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const isValidEmail = await User.findOne({email: req.body.email});
    if(!isValidEmail)
        return res.status(404).send("Invalid email or password.");

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if(!isValidPassword)
        return res.status(404).send("Invalid email or password.");

    res.send(true);
});

function validate(req) {
    const schema = {
        email:    Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;