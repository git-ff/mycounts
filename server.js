var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var path = require("path");
var mongoose = require("mongoose");


//mongodb Schema
var Schema = mongoose.Schema;
//mongodb Object
var ObjectId = Schema.ObjectId;
if ('development' == app.get('env')) {
  //connect to db
  var myDB = 'mongodb://localhost:27017/mycounts'
  mongoose.connect(myDB);
  var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected!
    });
  //create a new schema
  var usersSchema = new Schema({
      id: ObjectId,
      email: {
        type: String,
        unique: true,
        required: true,
      },
      password: {
        type: String,
        unique: false,
        required: true,
      },
  });
};

var user = mongoose.model('user', usersSchema);


var bodyParser = require("body-parser");
// to support JSON-encoded bodies:
app.use( bodyParser.json() );       
// to support URL-encoded bodies:
app.use(bodyParser.urlencoded({ extended: false}) ); 

//to see if anything happens
var logger = require ('./logger');
app.use(logger);

//load html files from public folder
app.use(express.static(__dirname + "/public/"));
//load assets: css, js, imgs, etc from public/assets
app.use(express.static(__dirname + '/public/assets'));


//get submitted data from the main page (login/register)
app.post("/", function(request, response){
  var loginEmail = request.body.loginemail;
  var loginPass = request.body.loginpass;
  var registrationEmail = request.body.registeremail;
  var registrationPass = request.body.registerpass;

  console.log("LEmail: " + loginEmail);
  console.log("LPass: " + loginPass);
  console.log("REmail: " + registrationEmail);
  console.log("RPass: " + registrationPass);

  //if we have registration e-mail and pass, - save to db
  if ( (registrationEmail != undefined) && (registrationPass != undefined) ){
    var newuser = new user ({
      email: request.body.registeremail,
      password: request.body.registerpass,
    });
    //save register data. On error - show in console.
    newuser.save(function (err, newuser) {
      if (err) {
        if (err.code === 11000) {
          error = "E-mail is taken already. Please, try another one."
          return console.error(error);
        } else {
          return console.error(err);
        };
      } else {
        response.redirect('/accounts');
      };
    });
  //if we have valid login e-mail and pass, - open summary
  } else if ( (loginEmail != undefined) && (loginPass != undefined) ){
      user.findOne( {email:loginEmail}, function(err, user) {
        if (!user) {
          response.write("Smth wrong with e-mail or pass");
        } else {
          if (loginPass === user.password) {
            response.redirect('/summary');
          } else {
            response.write("Smth wrong with e-mail or pass");
          };
        }
      });
  };
});



app.get("/newtransaction", function(request, response) {
  response.sendFile(path.join(__dirname+'/public/newtransaction.html'));
});

app.get ("/accounts", function(request, response) {
  response.sendFile(path.join(__dirname+'/public/accounts.html'));
});

app.get ("/summary", function(request, response) {
  response.sendFile(path.join(__dirname+'/public/summary.html'));
});

app.get ("/logout", function(request, response) {
  response.redirect("/");
});


app.listen(port, function(){
  console.log("Listening MyCounts on http://localhost:" + port);
  console.log("We run in _" + app.get('env') + "_ mode");
});