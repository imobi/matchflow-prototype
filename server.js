// server.js
// required modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var multer         = require('multer');
var ffmpeg         = require("fluent-ffmpeg");
var mongo 		   = require('mongodb');
var mongoose 	   = require('mongoose');
var fs 			   = require('fs');

//Set up and start our Node.js server
//Set our port
var port = process.env.PORT || 3000; 

//Node will serve static (front end) files,  /public/img will be reference as /img in frontend
app.use(express.static(__dirname + '/www')); 

//Set home page
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/www/index.html'); // load our public/index.html file
});

//Start app ===============================================
//Set app to listen to port defined above
app.listen(port);               

//Shoutout the port to the user                     
console.log('Running on port ' + port);

//Let's connect to MongoDB now
mongoose.connect('mongodb://localhost/flowbase', function(err) {
    if(err) {
        console.log('Connection error for MongoDB', err);
    } else {
        console.log('Connection successful to MongoDB');
    }
});

//Create schemas

//"Event Group" schema for storing groups of events (template) on Matchflow
var EventGroupSchema = new mongoose.Schema({
	"name":{"type":"String","unique":true},
	"colour":"String".
	"search_meta": "Array"
});

//"Event" Schema for storing individual events created on Matchflow
//Create an events definition schema which will be used to create events definition collection for the current project
var EventSchema = new mongoose.Schema({
	"name":"String",
	"before":"Number",
	"after":"Number"
});


//Create a projects schema to keep track of projects
var ProjectSchema = new mongoose.Schema({
  "name": {"type":"String","unique":true},
  "search_meta":"Array",
  "creation_date":{"type":"Date","default":Date.now},
  "video_date":{"type":"Date"},
  "video_link":"String",
  "league_selection":"String",
  "event_groups_selection":"String",
  "teams_selection":"Array",
});


var EventTagSchema = new mongoose.Schema({
	"event_id":{"type":"String", "unique":true},
	"timestamp":{"type":"Date"},
	"before":"Number",
	"after":"Number",
	"description":"String",
	"matchers":"Array"
});


//Create collections using schemas that we just defined
var EventGroupsCollection = mongoose.model('event_groups', EventGroupSchema);
var EventsCollection = mongoose.model('events',EventSchema);
var ProjectCollection = mongoose.model('projects', ProjectSchema);
var EventTagsCollection = mongoose.model('event_tags',EventTagSchema);


// Expose app so that server.js can be required by other modules        
exports = module.exports = app;     