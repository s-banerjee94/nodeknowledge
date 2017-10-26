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
    resave: true,
    saveUninitialized: true,
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

let articles = require('./routes/articles');
let articles = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

//start sever
app.listen(3000, function(){
    console.log("Server running port 3000");
});
