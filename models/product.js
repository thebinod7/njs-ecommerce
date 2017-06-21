var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Product = new Schema({
  id: ObjectId,
  title: {type: String, text: true},
  featuredImg : {type: String},
  images: {type: Array},
  price: {type: Number},
  brand: {type: String},
  seller : {type: String},
  size: [{type: String}],
  userId: {type: ObjectId, ref: 'Users'},
  categoryId: {type: ObjectId, ref: 'Category'},
  productDesc : {type: String},
  isDeleted : {
    type : Boolean,
    default : false
  },
  dateAdded : {
    type : Date,
    default: Date.now
  }
});

module.exports =  mongoose.model('Product', Product);
