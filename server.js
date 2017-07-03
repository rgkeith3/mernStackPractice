'use strict'

//first we import our dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./model/comments');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up or 3001
var port = process.env.API_PORT || 3001;

//db config
mongoose.connect('mongodb://mcb-test:mcbtest@ds147902.mlab.com:47902/mern-comment-box', {
  useMongoClient: true,
});

//now config the API to use bodyParser and look for JSON data in req body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//to prevent errors from Cross Origin Resource Sharing, we set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type,Access-Control-Request-Method, Access-Control-Request-Headers')

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path and initialize the API
router.get('/', function(req, res) {
  res.json({message: 'API Initialized!'});
});

//adding the /comments route to our /api router
router.route('/comments')
  //retrieve all comments form the db
  .get(function(req, res) {
    //looks at our Comment Schema
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);
      //responds with a json object of our db comments
      res.json(comments)
    });
  })
  //post new comment to db
  .post(function(req, res) {
    var comment = new Comment();
    //bodyParser lets us use the req.bodyParser
    comment.author = req.body.author;
    comment.text = req.body.text;

    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({message: 'Comment successfully added!'});
    });
  });

//adding route to a specific Comment based on the database ID
router.route('/comments/:comment_id')
  //put method for updating comment
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      //setting the new author and text to whatever was changed. If nothing was changed we will not alter the field.
      (req.body.author) ? comment.author = req.body.author : null;
      (req.body.text) ? comment.text = req.body.text : null;
      //save comment
      comment.save(function(err) {
        if (err)
          res.send(err);
        res.json({message:'Comment has been updated'});
      });
    });
  })
  //delete method for removing a comment from the db
  .delete(function(req, res) {
    //selects the comment by its ID, the removes it.
    Comment.remove({ _id: req.params.comment_id}, function(err, comment) {
      if (err)
        res.send(err);
      res.json({message: 'Comment has been deleted'})
    })
  });

//use our router config when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
