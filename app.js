const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

//creat a connectin to mongodb
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

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// bring models
let Article = require('./models/article');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

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

//get single article
app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        });
    });
});

// article/add route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title: "Add Article",
        heading: "Add Article"
    });
});

// add submit post route
app.post('/articles/add', function(req, res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});


//start sever
app.listen(3000, function(){
    console.log("Server running port 3000");
});