const {Customer,  validate} = require('../models/customer');
const express               = require('express');

const router = express.Router();

// handle CRUD operations for customer endpoints.

// create a new customer
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();

    res.send(customer);
});

// get all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// get specific customer
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(customer === undefined)
        res.status(404).send(`The customer with the given id:${req.params.id} not found.`);

    res.send(customer);
});

// update specific customer
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, {new: true});
    if(customer === undefined)
        res.status(404).send(`The customer with the given id:${req.params.id} not found.`);

    res.send(customer);
});

// delete specific customer
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(customer === undefined)
        res.status(404).send(`The customer with the given id:${req.params.id} not found.`);

    res.send(customer);
});

module.exports = router;