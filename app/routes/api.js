//myCounts api
var User = require('../models/users');
var Accounts = require('../models/accounts');
var Records = require('../models/records');
var config = require('../../config');

//secret key for token
var secretKey = config.secretKey;

//token generator
var jsonwebtoken = require('jsonwebtoken');
function createToken(user){
  var token = jsonwebtoken.sign({
    id: user.id,
    email: user.email
  }, secretKey, {   //from config.js
    expiresIn: 1440 
  });
  return token;
};


module.exports = function(app, express) {

  var api = express.Router();

  //create new user
  api.post('/', function(request, response) {
    //if email and pass for registration provided - register
    if (request.body.emailreg && request.body.passwordreg) {
      var user = new User({
        email: request.body.emailreg,
        password: request.body.passwordreg
      });
      user.save(function(error){
        if(error){
          response.send(error);
          return;
        } else {
          response.json({message: 'User has been created'});
        }
      });

      //else if email and pass for login provided - login and give token
    } else if (request.body.emaillog && request.body.passwordlog) {
      User.findOne({
        email: request.body.emaillog
      }).select('password').exec(function(error, email) {
        if(error) {
          throw error;
        };
        //email missing in DB?
        if(!email) {
          response.send({
            message: 'Email ' + request.body.emaillog + ' not found.'
          });
        } else if (email) {
          //password matches?
          var validPassword = email.comparePassword(request.body.passwordlog);         
          if(!validPassword){
            response.send({message: 'Invalid password'});
          } else {
            var token = createToken(email);           //token
            response.json({
              success: true,
              message: 'Successfully logged in.',
              token: token
            });     //response.json
          };        //else
        };          //else if
      });           //select('password').exec(function(error, email) 
    };              //else if (request.body.emaillog
  });               //api.post('/', function(request, response)



  //middleware to check if token is valid for performing an operation
  api.use(function(request, response, next){
    console.log('Smth came in');
    var token = request.body.token ||  request.query.token || request.headers['x-access-token']; //x-access-token is for postman
    //check if token exists
    console.log(token);
    if(token) {
      jsonwebtoken.verify(token, secretKey, function(error, decoded) {
        if(error) {
          response.status(403).send({
           success: false,
           message: 'Access denied. Failed to auth.'
         });
        } else {
          //
          request.decoded = decoded;
          next();
        }
      });
    } else {
      response.status(403).send({
       success: false,
       message: 'Access denied. No token provided.'
     });      
    }
  });


  //for using things below - legitimate token is needed
  api.route('/accounts')
  .post(function(request, response){
    var accounts = new Accounts({
      creator: request.decoded.id,
      accountLong: request.body.accountLong,
      accountShort: request.body.accountShort,
      accountCurrency:request.body.accountCurrency
    });
    accounts.save(function(error){
      if(error) {
        response.send(error);
        return;
      } else {
        response.json({
          message: 'Account created'
        });
      };
    });
  })

  .get(function(request, response){
    Accounts.find({
      creator: request.decoded.id,
      deleted: null
    }, function(error, accountList){
      if(error) {
        response.send(error);
        return;
      } else {
        response.json({
          accountList
        });
      };
    });
  })


  // .put(function(request, response){
  //   //make account marked deleted
  //   var accountID = ''; //how to get account id to delete?
  //   Accounts.findOne({
  //     id: accountID
  //   }, function (error, account) {
  //     if(!error){
  //       account.deleted = Date.now;
  //       account.save(function(error,account){
  //         console.log('Account deleted:', account);
  //       });
  //     } else {
  //       response.send(error);
  //     };
  //   });
  // })

  ;



  //submit new entry
  api.route('/newentry')
  .post(function(request, response){
    var records = new Records({
      creator: request.decoded.id,
      recordCurrency: request.body.recordCurrency,
      accountFrom: request.body.recordAccountFrom,
      accountTo: request.body.recordAccountTo,
      recordSum: request.body.recordSum,
      recordUserDate: request.body.recordUserDate,
      comment: request.body.recordComment,
      category: request.body.recordCategory
    });
    records.save(function(error){
      if(error) {
        response.send(error);
        return;
      } else {
        response.json({
          message: 'Record created'
        });
      };
    });
  })

  //get records for a user
  api.route('/records')
  .get(function(request, response){
    Records.find({
      creator: request.decoded.id,
      deleted: null
    }, function(error, recordsList){
      if(error) {
        response.send(error);
        return;
      } else {
        response.json({
          recordsList
        });
      };
    });
  })


  return api

};