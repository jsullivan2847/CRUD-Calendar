require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");

//MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
const userController = require("./controllers/users.js");
app.use("/User", userController);
const eventController = require('./controllers/events.js');
app.use('/', eventController);

//DATABASE CONNECTION
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log("mongo error", error));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

//HOME ROUTE
app.get("/SignUp", (req, res) => {
    res.render('home.ejs');
});



//LOGIN PAGE
app.get("/", (req, res) => {
    res.render("user/login.ejs", {
        currentUser: req.session.currentUser,
    });
});

//PORT CONNECTION
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("express is listening at ", PORT));
