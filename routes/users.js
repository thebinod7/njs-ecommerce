const express = require('express');
const  router = express.Router();
const Users= require('../models/users');
const nodemailer = require('nodemailer');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const auth = require('../utils/authenticate').auth;
const loggedIn = require('../utils/authenticate').loggedIn;

const dashboardLayoutData = {
  layout: 'layouts/dashboard'
};

var sendEmail = function (dest,name,uniqueId,purpose) {
  var content,sub;
  if(purpose === 'signup') {
    sub = 'User registration ✔';
    content = '<b>Congratulations '+ name +', you have been registered to Online Store.</b><br><a href="http://localhost:4321">Click here to start shopping!</a>' // html body
  } else if(purpose === 'forgotPass') {
    sub = 'Forgot Password Recovery ✔';
    content = '<b>Hi '+ name +', you have made a request to recover password.</b><br><a href="http://localhost:4321/users/forgot/'+ uniqueId +'">Click here to reset your password</a>' // html body
  }
  else {
    sub = 'Check Email✔';
    content === 'No purpose sent!'
  }
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'binod@rumsan.com',
            pass: 'T$mp1234'
        }
    });

// setup email data with unicode symbols
    var mailOptions = {
        from: 'binod@rumsan.com', // sender address
        to: dest, // list of receivers
        subject: sub, // Subject line
       // text: message, // plain text body
        html: content
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions,function () {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent successfully!');
      //  console.log('Message %s sent: %s', info.messageId, info.response);
    })
}

router.get('/signup',function (req,res) {
    data = {
        title: 'Signup - Online Store'
    },
        res.render('user/signup',data);
});

router.get('/login',function (req,res) {
    data = {
        title: 'Login - Online Store'
    },
        res.render('user/login',data);
});

router.get('/forgot/:id',function (req,res) {
    data = {
        title: 'User - Reset Password'
    },
        res.render('user/resetPassword',data);
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

router.get('/dashboard',auth,function (req,res) {
  Users.findById(req.session.userId, function(err, doc) {
      if(err){
          res.json({success : false, msg : 'User not found!'});
      } else {
        const data = Object.assign(dashboardLayoutData, {
              title:  'User - Dashboard',
              user: doc
            });
            res.render('user/dashboard', data);
      }
  });
});

router.get('/account',auth,function (req,res) {
  const data = Object.assign(dashboardLayoutData, {
        title:  'User - Dashboard'
      });
      res.render('user/changePassword', data);
});

router.post('/signup',function (req,res) {
    console.log(req.body);
    var newUser = new Users({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        phone : req.body.contactNumber,
        email : req.body.email,
        password : req.body.password
    });
    Users.getUserByEmail(newUser.email,function (err,userEmail) {
        if(err) throw err;
        if(userEmail){
          req.flash('error', 'Email already exits. Try new one or goto login!');
          res.redirect('/users/signup');
          return;
        }
        else {
            Users.addUser(newUser,function (err,doc) {
                if(err){
                  req.flash('error', 'Oops Something went wrong! Please try again');
                  res.redirect('/users/signup');
                } else {
                    sendEmail(doc.email,doc.firstName,doc._id,'signup');
                    req.flash('success', 'Congratulations, Your account has been successfully created. Please Login to continue!');
                    res.redirect('/users/login');
                // /    res.json({success:true,msg:'User added successfully',result:doc})
                }
            })
        }
    });
});

router.post('/login',function (req,res) {
    var users = new Users({
        email : req.body.email,
        password : req.body.password
    });
    Users.getUserByEmail(users.email, function (err, doc) {
        if(err) throw err;
        if(!doc){
            req.flash('error', 'Email not registered!');
            res.redirect('/users/login');
            return;
          //  return res.json({msg:'User does not exists.'});
        }
        Users.comparePassword(users.password,doc.password,function (err,isMatch) {
            if(err) throw err;
            console.log(isMatch);
            if(isMatch){
              req.session.userId = doc._id;
              req.session.user = doc;
              req.session.loggedIn = true;
              res.redirect('/users/dashboard');
            }
            else {
              req.flash('error', 'Wrong email or password!');
              res.redirect('/users/login');
            }
        });
    });
});

router.post('/changePassword',(req,res) => {
    const existUser = {
         password : req.body.oldPassword,
         newPassword : req.body.newPassword,
         id : req.session.userId
    }
    Users.findById({_id : existUser.id},function (err,isUser) {
        if(err) throw err;
        if(isUser){
            Users.comparePassword(existUser.password,isUser.password,function (err,isMatch) {
                console.log('Match:' + isMatch);
                if(err) throw err;
                if(isMatch){
                    Users.changePassword(existUser,function (err,doc) {
                        if(err){
                            res.json({success : false, msg : 'Error occured,try again!'});
                        } else {
                          req.flash('success', 'SUCCESS, Password has been updated successfully please login');
                          res.redirect('/users/logout');
                        }
                    })
                }
                else {
                  req.flash('error', 'ERROR, Wrong old password!');
                  res.redirect('/users/account');
                }
            });
        } else {
          req.flash('error', 'Oops! Something went wrong. Please try again.');
          res.redirect('/users/account');
        }
    })
});

router.get('/logout', (req, res) => {
  req.session.userId = null;
  req.session.loggedIn = false;
  req.session.user = null;
  res.redirect('/users/login');
});

router.get('/profile/:id',function (req,res) {
    Users.findById(req.params.id, function(err, doc) {
        if(err){
            res.json({success : false, msg : 'Failed to get!'});
        } else {
            res.json({success:true,msg:'Success',result:doc})
        }
    });
});

router.post('/forgot-password', (req,res) => {
  Users.findOne({'email' : req.body.email}, function(err,user) {
    if(err){
      req.flash('error', 'Your email is not registered to our system!');
      res.redirect('/users/login');
    } else {
      sendEmail(req.body.email,user.firstName,user._id,'forgotPass');
      req.flash('success', 'SUCCESS, An email has been sent to you. Please check your email to reset password!');
      res.redirect('/users/login');
    }
  });
});

router.post('/reset-password', (req,res) => {
  const existUser = {
       id : req.body.userId,
       password : req.body.password
  }
  Users.findOne({'_id' : existUser.id}, function(err,user) {
    if(err){
      req.flash('error', 'Your account is not registered in our system!');
      res.redirect('/users/login');
    } else {
          Users.resetPassword(existUser,function (err,doc) {
          console.log('doc' + doc);
          if(err){
            res.json({success : false, msg : 'Error occured,try again!'});
          } else {
            req.flash('success', 'Your password has been reset successfully, please login.');
            res.redirect('/users/login');
          }
      })
    }
  });
});

router.post('/update/:id',function (req,res) {
    Users.findById(req.params.id, function (err, doc) {
        if (err) {
            res.status(500).send(err);
        } else {
            doc.email = doc.email;
            doc.password = doc.password;
            doc.firstName = req.body.firstName || doc.firstName;
            doc.lastName = req.body.lastName || doc.lastName;
            doc.phone = req.body.phone || doc.phone;
            doc.save(function (err, data) {
                if (err) {
                    res.json({success:true,result:data,msg:'Unable to update profile! Please try again'});
                }
                res.json({msg:'Profile updated successfully!', success:true,result:data});
            })
        }
    });
});

router.post('/change/password',function (req,res) {
    var user_data = new Users({
        email : req.body.email,
        password : req.body.password,
        newPassword : req.body.newPassword
    });
    Users.getUserByEmail(user_data.email,function (err,isUser) {
        if(err) throw err;
        if(isUser){
            Users.comparePassword(user_data.password,isUser.password,function (err,isMatch) {
                console.log('Match:' + isMatch);
                if(err) throw err;
                if(isMatch){
                    Users.changePassword(user_data,function (err,doc) {
                        if(err){
                            res.json({success : false, msg : 'Error occured,try again!'});
                        } else {
                            Users.findOneAndUpdate({ email: user_data.email }, { $set: { password: user_data.newPassword } }, { new: true }, function(err, user) {
                              res.json({msg:"Password updated"});
                              return;
                                req.flash('success', 'Password has been set successfully!');
                                res.redirect('/admin');
                            });
                        }
                    })
                }
                else {
                    res.json({msg:"Wrong password"});
                }
            });
        } else {
          res.json({msg:"email not found"});
        }
    })
});

module.exports = router;
