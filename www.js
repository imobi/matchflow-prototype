var express        = require('express');
var app            = express();
var port = process.env.PORT || 8888; 
app.use(express.static(__dirname + '/www')); 
app.get('/', function(req, res) {
	res.sendFile(__dirname+'/www/index.html');
});
app.listen(port);               
console.log('Running on port ' + port);