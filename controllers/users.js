// const bcrypt = require(bcrypt);
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
router.use(express.urlencoded({ extended: true }));


//CALENDAR INDEX
router.get('/Calendar', (req,res) => {
  if(req.session.currentUser){
    User.findById(req.session.currentUser._id, (error, foundUser)=> {
      res.render('user/calendar.ejs', {
        user: foundUser,
        events: foundUser.event,
      })
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

//DELETE EVENT
router.delete('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (error, foundUser) => {
    foundUser.event.id(req.params.id).remove();
    foundUser.save((error) => {
      res.redirect('/User/Calendar');
    })
  })
})

// UPDATE EVENTS
router.put('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (error,updatedUser) => {
    updatedUser.event.id(req.params.id).title = req.body.title;
    updatedUser.save((error,result)=> {
      res.redirect('/User/Calendar');
    })
  })
})

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

//CREATES EVENT
router.post('User/Calendar', (req,res) => {
  User.findById(req.session.currentUser._id, (error, user) => {
    user.event.push(req.body);
    user.markModified('posts');
    user.save((error, result) => {
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
  });
});

module.exports = router;