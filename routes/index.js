const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/',function (req,res) {
Product
.find()
.sort({'dateAdded': -1})
.limit(9)
.exec(function(err, docs) {
      if(err){
          res.json({success : false, msg : 'Failed to list!'});
      } else {
        data = {
            title: 'Home - Online Store',
            products: docs
        },
        console.log(data);
        res.render('index',data);
      }
    });
});

module.exports = router;
