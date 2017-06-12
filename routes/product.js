const express = require('express');
const router = express.Router();

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

router.get('/add',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('product/add', data);
});

module.exports = router;
