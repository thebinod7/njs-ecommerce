const express = require('express');
const router = express.Router();

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

module.exports = router;
