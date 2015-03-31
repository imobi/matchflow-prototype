// server.js
// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var multer         = require('multer');
var ffmpeg         = require("fluent-ffmpeg");
var mongo 		   = require('mongodb');
var mongoose 	   = require('mongoose');

// set our port
var port = process.env.PORT || 3000; 

//connect to our MongoDB
mongoose.connect('mongodb://localhost/flowbase', function(err) {
    if(err) {
        console.log('Connection error for MongoDB', err);
    } else {
        console.log('Connection successful to MongoDB');
    }
});

//Create schemas
//Create a projects schema to keep track of projects
var ProjectsSchema = new mongoose.Schema({
  "name": {"type":"String","unique":true},
  "date_played":{"type":"Date"},
  "local_team":"String",
  "opposition_team":"String",
  "season":"String",
  "competition":"String",
  "local_team_score":"Number",
  "opposition_team_score":"Number",
  "date_created": { "type": "Date", "default": Date.now }
});

//Creates a collections schema to keep track of collections of events
var CollectionsSchema = new mongoose.Schema({
	"name":{"type":"String","unique":true},
	"date_created": {"type":"Date","default":Date.now}
});

//Create an events definition schema which will be used to create events definition collection for the current project
var EventsSchema = new mongoose.Schema({
	"collection_name":"String",
	"event_name":"String",
	"lead_time":"Number",
	"lag_time":"Number"
});

var ProjectsCollection = mongoose.model('projects', ProjectsSchema);
var CollectionsCollection = mongoose.model('collections',CollectionsSchema);
var EventsCollection = mongoose.model('events',EventsSchema);

// middleware ==============================================
//Database middleware

//CRUD for projects
//Get projects from projects table in database
app.use('/getprojects',function (req,res) {
	ProjectsCollection.find(function (err, projects) {
  		if (err) res.send("Error fetching projects from database.");
  		else { 
  			console.log(projects);
  			res.send(projects);
  		}
	});

});

//Add a new project
app.use ('/addproject', bodyParser.json(), function (req,res) {
	var projectName = req.body.projectName;
 	var newProject = new ProjectsCollection({"name": projectName, "description": "Empty for now"});
	newProject.save(function(err){
	    if(err) res.send({"success":false,"error":err});
	    else {
	    	//Create events definition collection for this project
	    	currentProjectEventDefinitionsCollection = mongoose.model(projectName.match(/[a-z0-9]/gi).join("")+'_event_defs',EventsDefinitionSchema);
	    	res.send({"success":true});
	    }
	});
});

//CR(U)D for collections: No update required as this will be done through events CRUD
//CREATE: Add a new collection
app.use('/addcollection', bodyParser.json(), function (req,res) {
	var newCollection = new CollectionsCollection ({"name":req.body.collectionName});
	newCollection.save(function (err) {
		if (err) res.send({"success":false,"error":err});
		else res.send({"success": true});
	});
});


//READ: Get exisiting collections
app.use('/getcollections',function (req,res) {
	CollectionsCollection.find(function (err, collections) {
		if (err) res.send([{"name":"Error fetching collections. Error message: "+err}])
		else res.send(collections);
	});
});


//DELETE: Remove an existing collection
app.use('/deletecollection',bodyParser.json(),function (req,res) {
	CollectionsCollection.remove({'name':req.body.collectionName},function (err) {
		if (err) res.send({"success":false,"error":err});
		else res.send({"success":true});
	});
})

//CRUD for events
//Get events for a collection

//CREATE: Add event to collection
app.use('/addevent', bodyParser.json(), function (req,res) {
	var newEvent = new EventsCollection({"collection_name":req.body.collection_name,"event_name":req.body.event_name,"lead_time":req.body.lead_time,"lag_time":req.body.lag_time});
	newEvent.save(function (err) {
		if (err) res.send({"success":false,"error":err});
		else {
				EventsCollection.find(function(err,events) {
					res.send({"success":true,"number_of_events":events.length,"events":events});
				});				
			}
	});
});

//READ: Get all events for the selected collection
app.use('/getevents',bodyParser.json(), function (req,res) {
	var collectionName = req.body.collectionName;
	EventsCollection.find({"collection_name":collectionName}, function (err,events) {
		if (err) res.send([{"name":"Error fetching events for this collection. Error message: "+err}])
		else res.send(events);
	});
});

//UPDATE: Update an event in the collection
app.use('/updateevent',bodyParser.json(), function (req,res) {
	EventsCollection.update({ "collection_name": req.body.collection_selected, "event_name":req.body.event_selected },
	 { "event_name": req.body.event_name, "lag_time":req.body.lag_time, "lead_time":req.body.lead_time}, function (err, numberAffected, raw_response) {
		  if (err) res.send({"success":false, "error":err});
		  else {		  	
		  	res.send({"success":true})
		  }
	});
});

//DELETE: Delete an event in the collection
app.use('/deleteevent',bodyParser.json(),function (req,res) {
	EventsCollection.remove({'collection_name':req.body.collectionName, "event_name":req.body.eventName},function (err) {
		if (err) res.send({"success":false,"error":err});
		else res.send({"success":true});
	});
})

//Create global variable for file name of video
var newFileName;

//Parse the file name before uploading file
app.use('/fileName', bodyParser.json(),function (request,response,next) {
	newFileName = request.body.file_name;
	response.send("Done parsing file name.");
});

app.use('/upload',multer({ dest: './public/Video Uploads/',

rename: function (fieldname,filename,request) {
    return newFileName;
 },

onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...');
},

onFileUploadComplete: function (file,request,response) {
  console.log(file.originalname + ' uploaded to  ' + file.path);
  fileName = file.originalname;
  uploadPath = file.path;
  response.send([fileName,uploadPath]);
  //startVideoConversion(fileName,uploadPath);
}
}));

//FFMPEG middleware
//Function uses fluent-ffmpeg module to encode and compress file according to chosen specifications
app.use('/getVideoMetaData',bodyParser.json(), function (request,response,next) {
	var fileName = request.body.fileName;
	var filePath = request.body.filePath;
	ffmpeg.ffprobe(filePath, function(err, metadata) {
		response.send(metadata);	
	}); 	
});

app.use('/convert',bodyParser.json(), function (request,response,next) {
	var responseData = [];
	var fileName = request.body.fileName;
	var filePath = request.body.filePath;
	var newVideoName = 'Converted_'+fileName.split('.')[0]+'.mp4';
	var convertedVideo = ffmpeg(filePath)
	    .fps(request.body.framerate)
	    .size(request.body.resolution)
	    .autopad()
	    .format('mp4')
	    .on('end', function() {response.send("Success! Converted video has beed saved as: "+newVideoName);})
	    .on('error',function(error) {response.send("Error happened during conversion: "+error.message);})	
	    .save(newVideoName);
});

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 
//app.use('/Video Uploads',express.static(__dirname + '/Video Uploads')); 

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:3000
app.listen(port);               

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;     