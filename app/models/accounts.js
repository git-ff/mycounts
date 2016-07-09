//myCounts accounts for records handle
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var AccountsSchema = new Schema({

  creator: { type: Schema.Types.ObjectId, ref: 'User' },  //created by - userid
  accountCurrency: {type: String, required: true},        //currency
  accountLong: {type: String, required: true},            //long name
  accountShort: {type: String, required: true},           //short name to display
  accountDisplayOrder: String,                            //position in accounts list
  created: { type: Date, default: Date.now},              //account created
  deleted: { type: Date, default: ''}                     //account deleted?
});

module.exports = mongoose.model('Accounts', AccountsSchema);