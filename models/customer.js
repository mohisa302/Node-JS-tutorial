const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model ('Coutomer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true},
    name: {
        type: String,   
        required: true,
        maxlength: 50,
        minlength: 5},
    phone: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 5}
}));

function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).max(50).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
  }

exports.Customer = Customer;
exports.validate = validateCustomer;