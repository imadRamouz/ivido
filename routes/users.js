const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/register', (req, res) => {
  const errors = [];
  if (req.body.password != req.body.passwordConf) {
    errors.push({ text: "password don't match!!" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: 'password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConf: req.body.password
    });
  }
  else {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          req.flash('errorMsg', 'Email alredy registred');
          res.redirect('/users/register');
        }
        else {
          const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          };

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              new User(newUser).save()
                .then(() => {
                  req.flash('successMsg', 'You registred successuflly');
                  res.redirect('/users/login');
                }).catch(err => {
                  console.log(err);
                  return;
                })
            });
          });
        }

      });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('successMsg', 'logout successfully');
  res.redirect('/users/login');
});

module.exports = router;