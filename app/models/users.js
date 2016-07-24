//myCounts users handle
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {unique: true}
  },
  password: {
    type: String,
    required: true,
    select: false  //don't return pass on retrieving the list of users
  }
});

//save new email + hash pass
UserSchema.pre('save', function(next) {   //pre is used to hash pass before saving
  var email = this;
  // hash the password, if the password has been changed or user is new
  if(!email.isModified('password')) return next();
  //hash pass
  bcrypt.hash(email.password, null, null, function(error, hash) {
    if(error) return next(error);
    //replace password with the hashed version
    email.password = hash;
    next();
  });
});

//compare a given password with the database hash using method created for Mongoose
UserSchema.methods.comparePassword = function(password) {
  var email = this;
  return bcrypt.compareSync(password, email.password);

};

//return the model to use later
module.exports = mongoose.model('User', UserSchema);