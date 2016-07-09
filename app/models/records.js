//myCounts transaction records handle
var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var RecordsSchema = new Schema({
  creator: {type: Schema.Types.ObjectId, ref: 'User'}, //who
  recordCurrency: {type: String, required: true},        //currency
  accountFrom: {type: String, required: true},           //account to -
  accountTo: {type: String, required: true},             //account to +
  //for income and expense technical accounts will be used.
  recordSum: {type: String, required: true},             //sum
  recordUserDate: {type: Date, required: true},          //record date by User
  created: {type: Date, default: Date.now},              //record creation date in db
  comment: {type: String, required: true},               //comment to identify record
  category: {type: String, required: false},             //category for summaries
  deleted: { type: Date, select: false, default: ''}     //deletion mark
});

module.exports = mongoose.model('Records', RecordsSchema);