const express = require('express');
const router = express.Router();


// ############################# HOME / INDEX  #############################


/* GET home page */
router.get('/', (req, res, next) => {
  const user = req.session.user
  res.render('index', {
    user: user
  });
});


// ############################# CHECK USER IS LOGGED IN #############################


// create a middleware that checks if a user is logged in
const loginCheck = () => {
  return (req, res, next) => {
    //if user is logged in, proceed to the next function
    if (req.session.user) {
      next();
    } else {
      //else if user is not logged in, redirect to login
      res.redirect("/login");
    }
  }
};



// ############################# MAIN #############################
// ############################# ACCESS  only AFTER LOGIN #############################

/* GET main  page */
router.get("/main", loginCheck(), (req, res, next) => {
  const user = req.session.user
  res.render("main", {
    user: user
  });
});



// ############################# PRIVATE #############################
// ############################# ACCESS  only AFTER LOGIN #############################

/* GET private page */
router.get("/private", loginCheck(), (req, res, next) => {
  const user = req.session.user
  res.render("private", {
    user: user
  });
});


module.exports = router;