module.exports = function(req, res, next) {
    //401 unautherized
    //403 forbidden
    if(!req.user.isAdmin) return res.status(403).send('Access denied!');

    next();
}