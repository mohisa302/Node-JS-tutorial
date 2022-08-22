//const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Joi = require('joi');
const {Genre, validate} =  require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


//when we call function like bellow, only the perform of it work not variable inside it.
//for example, only a router called. but when we refrence somthing, all the variable and object alo work
router.get('/', async (req, res) => {
  //throw new Error('oops');
  const genres = await Genre.find().sort('name');
  res.send(genres);
}); 

//use middleware
router.post('/', auth, async (req, res) => {
  try {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();
  
    res.send(genre);
  }
catch(ex) {
    res.status(500).send('somethinf failed.')
}
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.get('/:id',[auth, admin], async (req, res) => {
  //auth-> if  the client send valid token then if the user is admin
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

module.exports = router;