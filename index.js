const mongoose = require('mongoose');
const helmet   = require('helmet');
const morgan   = require('morgan');
const debug    = require('debug')('vidly::startup');
const express  = require('express');

mongoose.connect('mongodb://localhost/vidly')
.then(() => debug("Connected to mongodb..."))
.catch((err) => debug(err.message));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extends: true}));
app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('morgan is enabled...');
}

const port = process.env.PORT || 3000;
app.listen(port, () => { debug(`Listen to port ${port}`) });