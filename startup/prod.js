const helmet = require("helmet");
const compression = require('compression');

//add all the middleware for project
module.exports = function(app) {
    //take app object 
    app.use(helmet());
    app.use(compression());
}