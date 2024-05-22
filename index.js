const Joi          = require('joi');
Joi.objectId       = require('joi-objectid')(Joi);
const mongoose     = require('mongoose');
const helmet       = require('helmet');
const morgan       = require('morgan');
const debugstartup = require('debug')('vidly::startup');
const debugdb      = require('debug')('vidly::db');
const config       = require('config');
const express      = require('express');
const genres       = require('./routes/genres');
const customers    = require('./routes/customers');
const movies       = require('./routes/movies');
const rentals      = require('./routes/rentals');
const users        = require('./routes/users');

debugstartup('App Name: ' + config.get('name'));

mongoose.connect('mongodb://localhost/vidly')
.then(() => debugdb("Connected to mongodb..."))
.catch((err) => debugdb(err.message));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debugstartup('morgan is enabled...');
}

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

const port = process.env.PORT || 3000;
app.listen(port, () => { debugstartup(`Listen to port ${port}`) });
