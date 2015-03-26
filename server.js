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
//Create a projects collection to keep track of projects
var ProjectsSchema = new mongoose.Schema({
  "project_id": "ObjectId",
  "name": "String",
  "description": "String",
  "date_created": { "type": "Date", "default": Date.now }
});

//Create an events definition schema which will be used to create events definition collection for the current project
var EventsDefinitionSchema = new mongoose.Schema({
	"event_def_id":"ObjectId",
	"event_name":"String",
	"lead_time":"Number",
	"lag_time":"Number"
});

var ProjectsCollection = mongoose.model('projects', ProjectsSchema);
var currentProjectEventDefinitionsCollection;

// middleware ==============================================
//Database middleware

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

app.use('/addevent', bodyParser.json(), function (req,res) {
	console.log("Event info received:"+req.body.event_name);
	var newEvent = new currentProjectEventDefinitionsCollection({"event_name":req.body.event_name,"lead_time":req.body.lead_time,"lag_time":req.body.lead_time});
	newEvent.save(function (err) {
		if (err) res.send({"success":false,"error":err});
		else {
				currentProjectEventDefinitionsCollection.find(function(err,events) {
					res.send({"success":true,"number_of_events":events.length,"events":events});
				});				
			}
	});
});


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