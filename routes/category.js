const express = require('express');
const router = express.Router();
const Category = require('../models/category');

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/add',function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('category/add', data);
});

//Add Category
router.post('/save', (req, res) => {
  const payload = Object.assign({}, req.body, {
    userId : req.session.userId,
  });
  const category = new Category(payload);
  category.save((err) => {
    if(err) {
      console.log(err);
      req.flash('error', 'ERROR! Failed to add category');
      res.redirect('/category/add');
    } else {
      req.flash('success', 'SUCCESS! Category added successfully!');
      res.redirect('/category/add');
    }
  });
});


module.exports = router;
