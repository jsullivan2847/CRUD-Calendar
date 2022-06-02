//DEPENDENCIES
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Calendar = require('../models/Calendar');
router.use(express.urlencoded({ extended: true }));


//DAYJS API
const dayjs = require('dayjs');
const calendar = require('dayjs/plugin/calendar');
const toObject = require('dayjs/plugin/toObject');
const duration = require ('dayjs/plugin/duration');
dayjs.extend(toObject, calendar,duration);
dayjs().format();
const now = dayjs();



//Used to populate calendar view with days
function getDaysInMonth(date) {
  let length = new Array(date.daysInMonth());
  return length.fill('').map((day,index) =>{
    return {
      date: dayjs(`
      ${date.format('YYYY')}-
      ${date.format('M')}-
      ${index + 1}`).format('YYYY-MM-DD'),
      dayofMonth: index + 1,
      object: dayjs(date).toDate(),
    }
  });
};

;

const hours = Array(dayjs(now).toObject().hours).fill('').map((hour, index) => {
  return hour = index + 1
});

// console.log(dayjs().month(7).date(8).format('dddd, MMMM D YYYY'))
// console.log(dayjs().subtract(7, 'year').format('dddd, MMMM D YYYY'));





//CALENDAR INDEX
router.get('/Calendar', (req,res) => {
  if(req.session.currentUser){
    User.findById(req.session.currentUser._id, (error, foundUser)=> {
      res.render('user/calendar.ejs', {
        user: foundUser,
        events: foundUser.event,
        month: now.format('dddd, MMMM D YYYY'),
        days: getDaysInMonth(now),
        dayHours: Calendar.month.day,
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
    console.log()
    res.render('user/new.ejs', {
      today: now.date(req.params.index).format('YYYY-MM-DD'),
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
    updatedUser.event.id(req.params.id).title = req.body.title;
    updatedUser.event.id(req.params.id).day = req.body.day;
    updatedUser.event.id(req.params.id).hour = req.body.hour;
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
    console.log('event',foundEvent);
    res.render('user/showEvent.ejs', {
      event: foundEvent,
      day: foundEvent.day,
    })
  });
});


//SHOW DAY
router.get('/Day/:index', (req,res) => {
  User.findById(req.session.currentUser._id, (error, foundUser) => {
    console.log(foundUser.event[0].hour)
    console.log(Calendar.month.day[req.params.index].am[0]);
    res.render('user/showDay.ejs', {
      day: getDaysInMonth(now)[req.params.index],
      events: foundUser.event,
      dayHours: Calendar.month.day[req.params.index],
    })
  });
});

module.exports = router;
