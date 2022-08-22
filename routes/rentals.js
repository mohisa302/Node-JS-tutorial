//const Fawn = require('fawn');
const {Rental,validate} = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movies } = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut'); //sort in descending order
    res.send(rentals);
});

router.post('/', async(req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findById(req.body.customerId);
  if(!customer) return res.status(400).send('Invalid customer.');
  
  // //add something to check id is valid 
  //npm i joi-objectid
  // if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
  //   return res.status(400).send('Invalid customer.')

  const movie = await Movies.findById(req.body.movieId);
  if(!movie) return res.status(400).send('Invalid movie.');

  if(movie.numberInStock === 0) return res.status(400).send('movie not in stock!');
 
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      }
  }); 

  //use transaction to seprate task in mongoose
  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
// try{
//     new Fawn.Task() 
//         .save('rentals', rental) //work directly with collection
//         .update('movies', {_id:movie._id},{
//         $inc: {numberInStock: -1}
//     })
//     .run();
//   res.send(rental);
// }
// catch(err) {
//     res.status(500).send('Something failed');
// }
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movies.findByIdAndUpdate(req.params.id, {
    title:req.body.title, 
    genre: {
      _id: req.body._id,
      name: genre.name
    },
    numberInStock:req.body.numberInStock,
    dailyRentalRate:req.body.dailyRentalRate
    } ,{
    new: true
  }); 

  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movies.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('The customer with the given ID was not found.');

  res.send(movie);
});

module.exports = router; 
