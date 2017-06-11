const express = require('express');
const router = express.Router();

router.get('/signup',function (req,res) {
    data = {
        title: 'User Signup'
    },
        res.render('user/signup',data);
});

router.get('/login',function (req,res) {
    data = {
        title: 'User Login'
    },
        res.render('user/login',data);
});

module.exports = router;
