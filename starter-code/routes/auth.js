const express = require('express');
const bcrypt = require("bcrypt");

const router = express.Router();
const User = require("../models/User");


// ############################# SIGNUP #############################

/* GET signup page */
router.get("/signup", (req, res) => {
  res.render("signup");
});


/* POST  result from signup form  */
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  //check that a password is entered with at least 4 characters
  if (password.length < 4) {
    return res.render("signup", {
      message: "Your password must at least be 4 characters long!"
    });
  }

  //check a username was entered
  if (username === "") {
    return res.render("signup", {
      message: "You must enter a username!"
    });
  }

  //check whether username is unique
  User.findOne({
    username: username
  }).then(found => {
    if (found !== null) {
      res.render("signup", {
        message: "I'm sorry, this username is already taken."
      });
      // if username is unique, start user creation
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({
          username: username,
          password: hash
        })
        .then(dbUser => {
          //log in new user
          req.session.user = dbUser;
          //redirect to homepage
          res.redirect("/main");
        })
        //Catch in case of error
        .catch(err => {
          next(err);
        });
    }
  });

});



// ############################# LOGIN #############################

/* GET login page */
router.get("/login", (req, res) => {
  res.render("login");
});


/* POST result from signup form  */
router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    username: username
  }).then(found => {
    //check if username exists
    if (found === null) {
      //if user not found
      res.render("login", {
        message: "Invalid credentials"
      });
      return;
    }
    //check if password is correct
    if (bcrypt.compareSync(password, found.password)) {
      //password and hash match. USER IS SIGNED IN
      req.session.user = found;
      res.redirect("/main");
    } else {
      //password and hash don't match
      res.render("login", {
        message: "Invalid credentials"
      });
    }
  });
});


// ############################# LOGOUT #############################


/* GET logout  */
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    else res.redirect("/");
  });
});




module.exports = router;