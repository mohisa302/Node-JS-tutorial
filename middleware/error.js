//winston is a storage for
//console,file,http,mongodb, couchdb, redis, loggly
const winston = require('winston');

//error
//Warn
//info for database
//verbose
//debug
//silly

module.exports = function (err, req, res,next) {
    winston.error(err.message, err);
    res.status(500).send('something failed.');
}