const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function auth(req, res, next) {
    //make avaible only for autheticated users with header
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access denied. no token provided.");

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        //put token in request(already had user id in request)
        req.user = decoded;
        //pass to next middleware
        next();
    }
    catch(ex) {
        res.status(400).send('Invalid token');
    }
}

