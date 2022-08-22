const Joi = require('joi');
const express = require('express');
const winston = require('winston');

//middleware function
const app = express();
require('./startup/loggin');
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`listening to port ${port} ...`));


//type of test
//unit - integration - end to end
//unit test app without external dependencies
//integration a class and . with external dependencies
//end to end drive application through ui

//all of test test pyramid
//most of test should be unit, then integration and few of them e2e
//complex loop, condition and calculation -> unit

//test - > library + testrunner
