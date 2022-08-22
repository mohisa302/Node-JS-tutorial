const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} =  require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//in validate function we validate tha in body we have name email and password
//create user
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    //user didnt already register
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already register');


    //save in database
    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
 
    //we want after registration the user ge into site and dont need to enter with username
    //const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();
    
    //change our api header with token
    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'email', 'password']));
    //only return some property
    //res.send(_.pick(user,['_id', 'name','email']));
});

module.exports = router;