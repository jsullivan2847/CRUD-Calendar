const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dayjs = require('dayjs');
const calendar = require('dayjs/plugin/calendar');
dayjs.extend(calendar);
dayjs().format();

const today = dayjs().format('D');
//EVENT
const eventSchema = new Schema({
    title: {type: String, required: true},
    details: String,
    day: String,
    hour: {type: Number, default: 12},
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