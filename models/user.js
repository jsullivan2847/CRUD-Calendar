const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//EVENT
const eventSchema = new Schema({
    title: {type: String, required: true},
    details: String,
    hours: {type:Number, default: 24},
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