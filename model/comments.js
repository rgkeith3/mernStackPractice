//creating db Schema

'use strict';

//import dependencies
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that dictates
//the shape of the database entries
var CommentsSchema = new Schema({
  author: String,
  text: String
});

//export for use in server.js
module.exports = mongoose.model('Comment', CommentsSchema);
