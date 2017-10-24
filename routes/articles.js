const express = require('express');

let router = express.router();

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
router.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title: "Add Article",
        heading: "Add Article"
    });
});

// add submit post route
router.post('/articles/add', function(req, res) {
    req.checkBody('title', 'Titel is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    //get the error
    let errors = req.validationErrors();
    if(errors) {
        res.render('add_article', {
            title: "Add Article",
            errors: errors
        });
    }
    else {
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
    }
});

//load edit form
router.get('/article/edit/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            article: article,
            heading: "edit article" + article.title
        });
    });
});

// add edit post route
router.post('/articles/edit/:id', function(req, res) {
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
            req.flash('success', 'Aricle edited!');
            res.redirect('/');
        }
    });
});

// article delete route 
router.delete('/article/:id', function(req,res) {
    let query = {_id:req.params.id};


    Article.remove(query, function(err) {
        if(err) {
            console.log(err);
        }
        res.send('Success');
    });
});
