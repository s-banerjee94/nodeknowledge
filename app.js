const express = require('express');
const path = require('path');

//init app
const app = express();

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home route
app.get('/', function(req, res) {
    res.render('index', {
        title: "Welcome",
        heading: "Articles"
    });
});

//add route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title: "Welcome",
        heading: "Add Article"
    });
});

//start sever
app.listen(3000, function(){
    console.log("Srever running port 3000");
});