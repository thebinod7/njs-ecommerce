const express = require('express');
const router = express.Router();

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/add',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('category/add', data);
});

module.exports = router;
