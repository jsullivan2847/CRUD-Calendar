require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.log("mongo error", error));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.get('/', (req,res) => {
    res.send('hello');
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log('express is listening at ', PORT));