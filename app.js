const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.on('open', function() {
    console.log("Connected to mongodb");
});

// check for db errors
db.on('error', function(err) {
    console.log(err)
});


//init app
const app = express();

// bring models
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if(err) {
            console.log(err);
        }
        else {
            res.render('index', {
                title: "Welcome",
                heading: "Articles",
                articles: articles
            });
        }
    });
});


//start sever
app.listen(3000, function(){
    console.log("Server running port 3000");
});