module.exports = function (handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch(ex) {
            next(ex);
        }
    };
}

// the express-async-errors module wrape any express standrd route handle into somthing like the mentioned function above.