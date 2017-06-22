const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const auth = require('../utils/authenticate').auth;
const multer  = require('multer');

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

var storage = multer.diskStorage({
  destination: './public/assets/img/uploads/',
  filename (req, file, cb) {
    cb(null,
      file.fieldname + '-' + Date.now() + '.' +
      file.originalname.split('.')[file.originalname.split('.').length - 1]
    );
  }
});

const upload = multer({ storage });

router.post('/uploadImg', upload.single('file'), function(req, res) {
  res.json({
    error: false,
    result: req.file.filename
  });
});

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

router.get('/add',auth,function (req,res) {
  Category.find({}, function(err, docs) {
        if(err){
            res.json({success : false, msg : 'Failed to list!'});
        } else {
          const data = Object.assign(dashboardLayoutData, {
                title:  'User - Dashboard',
                category: docs
              });
              res.render('product/add', data);
        }
    });
});

router.post('/save',function(req,res){
  const images = req.body.images.split(',');
  const featuredImg = images[0];
  images.splice(0, 1);
  const size = req.body.size.split(',');
      const payload = Object.assign({}, req.body, {
      featuredImg,
      images,
      size,
      userId : req.session.userId,
    });
  const product = new Product(payload);
  product.save((err) => {
  if(err) {
        console.log(err);
        req.flash('error', 'ERROR! Failed to add product');
        res.redirect('/product/add');
      } else {
        req.flash('success', 'SUCCESS! Product added successfully!');
        res.redirect('/product/my-listings');
      }
  });
});

router.get('/my-listings',auth,function (req,res) {
  Product.find({userId : req.session.userId }, function(err, docs) {
        if(err){
            res.json({success : false, msg : 'Failed to list!'});
        } else {
          const data = Object.assign(dashboardLayoutData, {
                title:  'User - Dashboard',
                products: docs
              });
              res.render('product/myListings', data);
        }
    });
});

router.get('/edit/:id',auth,function (req,res) {
  Product
    .findById(req.params.id)
    .populate('categoryId')
    .exec(function(err, doc) {
        if(err){
            res.json({success : false, msg : 'Failed to list!'});
        } else {
          const data = Object.assign(dashboardLayoutData, {
                title:  'User - Dashboard',
                product: doc
              });
              res.render('product/edit', data);
        }
    });
});

router.get('/view/:id',function (req,res) {
  Product
    .findById(req.params.id)
    .populate('categoryId')
    .exec(function(err, doc) {
        if(err){
            res.json({success : false, msg : 'Failed to list!'});
        } else {
          const images = [doc.featuredImg].concat(doc.images.filter(i => i.length));
          const data = {
                title:  'Product Details',
                product: doc,
                images
              };
              console.log(data.product);
              res.render('product/details', data);
        }
    });
});

router.get('/delete/:id',function (req,res) {
  Product.remove({ _id: req.params.id }, function(err) {
    if (err) throw err;

    req.flash('success', 'SUCCESS! Product deleted successfully!');
    res.redirect('/product/my-listings');
  });
});

module.exports = router;
