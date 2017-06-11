const express = require('express');
const router = express.Router();

router.get('/',function (req,res) {
    data = {
        title: 'Home - Online Store'
    },
        res.render('index',data);
});

module.exports = router;
