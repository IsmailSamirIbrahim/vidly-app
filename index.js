const mongoose     = require('mongoose');
const helmet       = require('helmet');
const morgan       = require('morgan');
const debugstartup = require('debug')('vidly::startup');
const debugdb      = require('debug')('vidly::db');
const config       = require('config');
const express      = require('express');
const genres       = require('./routes/genres');
const customers    = require('./routes/customers');

debugstartup('App Name: ' + config.get('name'));

mongoose.connect('mongodb://localhost/vidly')
.then(() => debugdb("Connected to mongodb..."))
.catch((err) => debugdb(err.message));

const app = express();
app.use(express.json());
app.use(express.urlencoded({extends: true}));
app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debugstartup('morgan is enabled...');
}

app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => { debugstartup(`Listen to port ${port}`) });
