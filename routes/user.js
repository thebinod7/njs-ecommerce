const express = require('express');
const router = express.Router();

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/signup',function (req,res) {
    data = {
        title: 'Signup - Onlne Store'
    },
        res.render('user/signup',data);
});

router.get('/login',function (req,res) {
    data = {
        title: 'Login - Online Store'
    },
        res.render('user/login',data);
});

router.get('/cart',function (req,res) {
    data = {
        title: 'Cart - Online Store'
    },
        res.render('user/cart',data);
});

router.get('/checkout',function (req,res) {
    data = {
        title: 'Checkout - Online Store'
    },
        res.render('user/checkout',data);
});

router.get('/dashboard',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('user/dashboard', data);
});

module.exports = router;
