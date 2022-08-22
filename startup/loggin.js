const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    //when we have a expection but nowhereused catch block(sync)
// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

winston.handleExceptions(
    //print log on console
    new winston.transports.Console({ colorize: true, prettyPrint: true}),
    new winston.transports.File({ filename: 'uncaughtException.log'}));

process.on('unhandleRejection', (ex) => {
    // winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
});

winston.add(winston.transports.File, {filename: 'logfile.log'});
//log on database
//winston.add(winston.transports.MongoDB, {
// db : 'mongodb://localhost/vidly' ,
// level: 'info'
//});
}