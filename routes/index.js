const express = require('express');
const router = express.Router();

router.get('/',function (req,res) {
    data = {
        title: 'User Management System'
    },
        res.render('index',data);
});

module.exports = router;