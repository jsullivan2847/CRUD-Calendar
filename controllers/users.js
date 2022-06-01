const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Calendar = require('../models/Calendar');
router.use(express.urlencoded({ extended: true }));
const dayjs = require('dayjs');
dayjs().format();
const now = dayjs();

console.log(now);

function Today() {
  const today = new Date();
  return date = today.getFullYear() + '-' + (today.getMonth() + 1) + "-" + today.getDate();
};

const today = Today();


//CALENDAR INDEX
router.get('/Calendar', (req,res) => {
  if(req.session.currentUser){
    User.findById(req.session.currentUser._id, (error, foundUser)=> {
      res.render('user/calendar.ejs', {
        user: foundUser,
        events: foundUser.event,
        days: Calendar.month.day,
      })
    });
  }
  else{
    res.send('you need to login to see this page');
  }
});

//NEW EVENT
router.get('/NewEvent/Day/:index', (req,res) => {
  if(req.session.currentUser){
    res.render('user/new.ejs', {
      day: Calendar.month.day[req.params.index],
      today: today,
    });
  }
});

//DELETE EVENT
router.delete('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (error, theUser) => {
    theUser.event.id(req.params.id).remove();
    theUser.save((error) => {
      res.redirect('/User/Calendar');
    });
  });
});

// UPDATE EVENTS
router.put('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id,(error,updatedUser) => {
    console.log(updatedUser);
    updatedUser.event.id(req.params.id).title = req.body.title;
    updatedUser.save((error,result)=> {
      res.redirect('/User/Calendar');
    });
  });
});

//SENDS LOGIN REQUEST
router.post('/Login', (req,res) => {
  User.findOne({email: req.body.email}, (error, foundUser) => {
    if(!foundUser) {
      res.send('sorry no user with that email');
    }
    else {
      const passwordMatches = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );
      if(passwordMatches){
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
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  
  User.create(req.body, (error, createdUser) => {
      res.redirect('/');
  });
});

//CREATES EVENT
router.post('/Calendar', (req,res) => {
  User.findById(req.session.currentUser._id, (error, user) => {
    user.event.push(req.body);
    user.save((error, result) => {
      res.redirect('/User/Calendar');
    });
  });
});


//EDIT

// SHOW PAGES

//SHOW EVENT
router.get('/Event/:id', (req,res) => {
  User.findById(req.session.currentUser._id, (error,user) => {
    const foundEvent = user.event.id(req.params.id)
    res.render('user/showEvent.ejs', {
      event: foundEvent,
      day: Calendar.month.day[foundEvent.day],
    })
  });
});

//SHOW DAY
router.get('/Day/:index', (req,res) => {
  User.findById(req.session.currentUser._id, (error, foundUser) => {
    res.render('user/showDay.ejs', {
      day: Calendar.month.day[req.params.index],
      events: foundUser.event,
    })
  });
});

module.exports = router;
