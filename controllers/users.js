// const bcrypt = require(bcrypt);
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
router.use(express.urlencoded({ extended: true }));


//CALENDAR INDEX
router.get('/Calendar', (req,res) => {
  if(req.session.currentUser){
    res.render('user/calendar.ejs', {
      user: req.session.currentUser,
    });
  }
  else{
    res.send('you need to login to see this page');
  }
})

//NEW EVENT
router.get('/NewEvent', (req,res) => {
  if(req.session.currentUser){
    res.render('user/new.ejs');
  }
});

//UPDATE??? SENDS LOGIN REQUEST
router.post('/Login', (req,res) => {
  User.findOne({email: req.body.email}, (error, foundUser) => {
    if(!foundUser) {
      res.send('sorry no user with that email');
      //console.log(foundUser);
    }
    else {
      if(req.body.password === foundUser.password){
        req.session.currentUser = foundUser;
        res.redirect('/User/Calendar/');
      }
      else{
        res.send('wrong password');
      }
    }
  })
});

//CREATES USER
router.post('/', (req,res) => {
  User.create(req.body, (error, createdUser) => {
      res.redirect('/');
  });
});

module.exports = router;