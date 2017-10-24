const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


//creat a connectin to mongodb
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.on('open', function() {
    console.log("Connected to mongodb");
});

// check for db errors
db.on('error', function(err) {
    console.log(err);
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


//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }));

  //express messages middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });


//Express validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


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
            article: article,
            title: article.author+"'s article" 
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
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
});

//load edit form
app.get('/article/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            article: article,
            heading: "edit article" + article.title
        });
    });
});

// add edit post route
app.post('/articles/edit/:id', function(req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        }
        else {
            res.redirect('/');
        }
    });
});

// article delete route 
app.delete('/article/:id', function(req,res) {
    let query = {_id:req.params.id};


    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});


//start sever
app.listen(3000, function(){
    console.log("Server running port 3000");
});
