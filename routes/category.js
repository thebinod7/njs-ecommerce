const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const auth = require('../utils/authenticate').auth;

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

router.get('/add',auth,function (req,res) {
  Category.find({}, function(err, docs) {
      if(err){
          res.json({success : false, msg : 'Failed to list!'});
      } else {
        const data = Object.assign(dashboardLayoutData, {
              title:  'User - Dashboard',
              category: docs
            });
            res.render('category/add', data);
      }
  });
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

router.get('/delete/:id', (req,res) => {
  Category.remove({ _id: req.params.id }, function(err) {
  if (err) throw err;

  req.flash('success', 'SUCCESS! Category deleted successfully!');
  res.redirect('/category/add');
  });
});


module.exports = router;
