const express = require('express');

let router = express.Router();

// bring in article models
let User = require('../models/user');

//register form
router.get('/register', function(req,res) {
    res.render('register');
});