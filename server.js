//myCounts server
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var path = require("path");

var app = express();

// to support URL-encoded bodies:
app.use(bodyParser.urlencoded({extended: true})); 
// to support JSON-encoded bodies:
app.use(bodyParser.json());
app.use(morgan('short'));


var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


//declare and serve index.html
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));


mongoose.connect(config.database, function(error){
  if(error){
    console.error.bind(console, 'Connection error:' + error)
  } else {
    console.log("MongoDB connected successfully to:\n" + config.database);
  }
});


//provide frontend
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


app.listen(config.port, function(error){
  if(error){
    console.log(error);
  } else {
    console.log('\nListening myCounts on http://localhost:' + config.port);
    console.log('We run in _' + app.get('env') + '_ mode');
    console.log('Database status:');
  }
});