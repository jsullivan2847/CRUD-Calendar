// const bcrypt = require(bcrypt);
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

//LOGIN PAGE
router.get("/Login", (req, res) => {
    res.render("user/login.ejs", {
        currentUser: req.session.currentUser,
    });
});

//CALENDAR INDEX
router.get('/Calendar', (req,res) => {
   console.log('user schema', User);
  if(req.session.currentUser){
    res.render('user/calendar.ejs');
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

// CREATES EVENT
router.post('/Calendar', (req,res) => {
  req.session.currentUser.event.push(req.body);
  req.session.save((error) => {
    res.redirect('/User/Caledar');
  });
});
module.exports = router;