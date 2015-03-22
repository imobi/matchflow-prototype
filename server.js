// server.js
// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var multer         = require('multer');
var ffmpeg         = require("fluent-ffmpeg");

// configuration ===========================================
// config files
//var db = require('./config/db');

// set our port
var port = process.env.PORT || 3000; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url); 

// middleware ==============================================

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
	    .on('end', function() { response.send("Success! Converted video has beed saved as: "+newVideoName);})
	    .on('error',function(error) {response.send("Error happened during conversion: "+error.message);});	
  	convertedVideo.save(newVideoName);
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