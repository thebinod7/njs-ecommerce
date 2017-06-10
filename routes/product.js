const express = require('express');
const router = express.Router();

router.get('/details',function (req,res) {
    data = {
        title: 'Prodcut Details'
    },
        res.render('product/details',data);
});

module.exports = router;
