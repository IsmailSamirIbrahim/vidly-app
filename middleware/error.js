module.exports = function (err, req, res, next) {
    // [TODO]: log the exception here...
    res.status(500).send('Somthing failed.');
}