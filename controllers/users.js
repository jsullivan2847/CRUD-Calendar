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
      events: req.session.currentUser.event,
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

//DELETE

//UPDATE??? SENDS LOGIN REQUEST
router.post('/Login', (req,res) => {
  User.findOne({email: req.body.email}, (error, foundUser) => {
    if(!foundUser) {
      res.send('sorry no user with that email');
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


router.post('User/Calendar', (req,res) => {
  User.findById(req.session.currentUser._id, (error, user) => {
    user.event.push(req.body);
    user.save((error) => {
      res.redirect('User/Calendar')
    });
  });
});


//EDIT

//SHOW PAGES

router.get('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (error,user) => {
    const foundEvent = user.event.id(req.params.id)
    res.render('user/showEvent.ejs', {
      event: foundEvent,
    })
    // console.log(foundEvent);
  });
});

module.exports = router;