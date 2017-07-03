'use strict'

//first we import our dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up or 3001
var port = process.env.API_PORT || 3001;

//now config the API to use bodyParser and look for JSON data in req body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//to prevent errors from Cross Origin Resource Sharing, we set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type,Acces-Control-Request-Method, Access-Control-Request-Headers')

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now we can set the route path and initialize the API
router.get('/', function(req, res) {
  res.json({message: 'API Initialized!'});
});

//use our router config when we call /api
app.use('/api', router);

//starts teh server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
