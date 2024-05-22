const {User, validate} = require('../models/user');
const bcrypt           = require('bcrypt');
const jwt              = require('jsonwebtoken');
const express          = require('express');

const router = express.Router();

// create a new user [Register a new user and authenticate directly]
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const isRegistered = await User.findOne({email: req.body.email});
    if(isRegistered)
        return res.status(400).send('The user is already registered.');

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
   
    res.header('x-auth-token', token).send({_id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin});
});

module.exports = router;