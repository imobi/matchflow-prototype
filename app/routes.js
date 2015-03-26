 // app/routes.js

// grab the nerd model we just created
//var Nerd = require('./models/nerd');

    module.exports = function(app) {

        // server routes ===========================================================
       
        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('/', function(req, res) {
            res.sendFile(__dirname+'/public/index.html'); // load our public/index.html file
        });
    };
