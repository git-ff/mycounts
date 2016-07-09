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
    select: false
  }
});

//save new email + hash pass
UserSchema.pre('save', function(next) {
  var email = this;
  if(!email.isModified('password')) return next();
  bcrypt.hash(email.password, null, null, function(error, hash) {
    if(error) return next(error);
    email.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  var email = this;
  return bcrypt.compareSync(password, email.password);

};


module.exports = mongoose.model('User', UserSchema);