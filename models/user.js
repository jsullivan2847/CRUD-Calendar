const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dayjs = require('dayjs')
dayjs().format()

//EVENT
const eventSchema = new Schema({
    title: {type: String, required: true},
    details: String,
    day: Number,
    // start: Date,
    // end: Date,
    completed: {type: Boolean, default: false},
});


//USER
const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    event: [eventSchema],
});

const User = mongoose.model('User', userSchema);



module.exports = User;