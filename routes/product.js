const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const auth = require('../utils/authenticate').auth;

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/details',function (req,res) {
    data = {
        title: 'Product Details - Online Store'
    },
        res.render('product/details',data);
});

router.get('/listing',function (req,res) {
    data = {
        title: 'Online Store - Shop'
    },
        res.render('product/listing',data);
});

router.get('/add',auth,function (req,res) {
  Category.find({}, function(err, docs) {
        if(err){
            res.json({success : false, msg : 'Failed to list!'});
        } else {
          const data = Object.assign(dashboardLayoutData, {
                title:  'User - Dashboard',
                category: docs
              });
              res.render('product/add', data);
        }
    });
});

router.post('/save',function(req,res){
  console.log(req.body);
});

module.exports = router;
