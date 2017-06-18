var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Category = new Schema({
  categoryName: String,
  categoryDesc: String,
  userId: {type: ObjectId, ref: 'Users'},
  dateAdded : {
      type : Date,
      default: Date.now
  }
});

module.exports =  mongoose.model('Category', Category);
