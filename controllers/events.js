const express = require('express');
const router= express.Router();
const User = require('../models/user.js');
router.use(express.urlencoded({ extended: true }));


// CREATES EVENT
router.post('/User/Calendar', (req,res) => {
    req.session.currentUser.event.push(req.body);
    console.log(req.session.currentUser);
    res.redirect('/User/Calendar');
  });

module.exports = router;