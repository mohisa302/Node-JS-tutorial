const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} =  require('../models/user'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const config = require('config');
//json token 
//the liscence or pass which after auth we gave it to client
//three part
//fisrt is header, type: jwt 
//second is object or payload
//third is private key which only avaible in server and hacker cant access it
const jwt = require('jsonwebtoken');

//create user
router.post('/', async (req, res) => {
    const { error } = validate(req.body);  
    if (error) return res.status(400).send(error.details[0].message);
  
    //user didnt already register
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('password is wrong!')
    
    //the usr module is responsible for geerating payload and token so 
    //we define method to countinue with it
     
    //send jwt, user id and and private key, but we use env for private key
    //const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required()
    };
    
    return Joi.validate(req, schema);
  }
  
module.exports = router;