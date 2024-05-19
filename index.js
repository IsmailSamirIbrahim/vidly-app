const mongoose = require('mongoose');
const helmet   = require('helmet');
const morgan   = require('morgan');
const debug    = require('debug')('vidly::startup');

mongoose.connect('mongodb://localhost/vidly')
.then(() => debug("Connected to mongodb..."))
.catch((err) => debug(err.message));

app.use(helmet());

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('morgan is enabled...');
}
