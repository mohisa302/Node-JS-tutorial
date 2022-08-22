const express = require('express');
const config = require('config');
const winston = require('winston');

module.exports = function() {
    //make sure to defining private key
    //set vidly_jwtPrivateKey=mySecureKey
    if(!config.get('jwtPrivateKey')) {
        throw new Error('FETAL ERROR: jwtPrivateKey is not defined.');
    }
}