const winston = require('winston');

// handle errors in the request process pipline.
module.exports = function (err, req, res, next) {
    winston.error(err.message, err);
    res.status(500).send('Internal server error, somthing failed.');
}