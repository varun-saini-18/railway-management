const express = require('express');
const app = express();
const Joi = require('@hapi/joi');
const movies = require('./movies');
const dbService = require('./dbService');
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(bodyParser.json());

app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: 'Cat',
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);

const initializePassport = require("./passportConfig");
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));

app.use('/abc', movies);

app.get("/", (req, res) => {
    res.render("index");
  });

app.get("/users/login", checkAuthenticated, (req, res) => {
  // flash sets a messages variable. passport sets the error message
  // console.log(req.session.flash.error);
  res.render("login.ejs");
});

app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();

  const result = db.getAllData();
  result
  .then(data => {
          response.json({data : data})
      })
  .catch(err => console.log(err));
});

app.post('/users/register', (request,response) => {
  const db = dbService.getDbServiceInstance();
  console.log(request.body);
  const { username,email,password,plan}= request.body;
  // console.log(username,email,password,plan);
  const result = db.registerUser(username,email,password,plan);
  result.then(data => {
          response.json({data : data})
      })
  .catch(err => console.log(err));
})


app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);


app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}










const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server started on Port ${port}`));

