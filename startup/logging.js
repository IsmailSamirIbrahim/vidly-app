const winston = require('winston');
                require('winston-mongodb');

module.exports = function() {
    winston.exceptions.handle(
        new winston.transports.Console({}),
        new winston.transports.File({filename: 'logs/uncaughtException.log'})
    );
    
    winston.rejections.handle(
        new winston.transports.Console({}),
        new winston.transports.File({filename: 'logs/unhandledRejection.log'})
    );
    
    winston.add(new winston.transports.Console({}));
    winston.add(new winston.transports.File({filename: 'logs/logfile.log'}));
    winston.add(new winston.transports.MongoDB({
        db: 'mongodb://localhost/vidly',
        level: 'info',
        options: {
            useUnifiedTopology: true,
        }
    }));
}