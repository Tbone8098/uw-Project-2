var express = require("express");
var router = express.Router();
const db = require('../models')

// use router.get router.post router.put router.delete
router.get("/", (req, res) => {
  res.render("index")
})


// Signup route
router.get("/signup", (req, res) => {
    res.render("partials/register", {
      user:req.session.user
    })
})

// Login route
//TODO: need a login handlebars file?
router.get("/login", (req, res) => {
    res.render("partials/login", {
      user:req.session.user
    })
})

// list of the upcoming events for user, top Y?
// toggle to include others events
// list of X connections
// chat - when AI is asked for past/future intent of TARGETNAME - query TARGETNAME for event in past/future -
// maybe a POST request to the AI handler with a GET request to the database nested inside?
router.get("/dashboard", (req, res) => {
    res.render("partials/dashboard");
})

// takes you to a single event?
// find one single event and all the associated data
// friends activities - query the user's associations, then query the associations events and return the Z events for them at that time (of the original event)
// query for any associate that has an event at the same time
router.get("/events", (req, res) => {
    res.render("partials/events");
})

// findOne for a single event, then check to make sure that you are logged in and that you are the admin
// if true, then you can edit and access the POST request
// QUERY to findOne event
router.get("/event/edit", (req, res) => {
    res.render("partials/oneEvent");
})

// findAll where you have an assciation with them
router.get("/friends/:id", (req, res) => { // use friends/:id if they don't need to be logged in
  // find a single user that is logged in
  db.User.findOne({
    where:{
      id: req.params.id //req.session.user.id if they don't need to be logged in
    },
    include:[{
      model:db.User,
      as: 'Associate',
    }]
  }).then(userData => {
    // take data that is an object with all of the users associations, turn it into JSON
    console.log(userData);
    const userJson = userData.toJSON();
    // make an object that is just the usernames of the associations
    const hbsObj = {
      username:userJson.username
    }
    //pass that object to the frontend
    // res.json(userData)
    res.render("partials/friends", hbsObj);
  }).catch(err => {
    res.status(500).json(err)
  })
})

// findOne user, findAll events for that user
router.get("/friend/one", (req, res) => {
    res.render("partials/oneFriend");
})

// chat - when AI is asked for past/future intent of TARGETNAME - query TARGETNAME for event in past/future -
// maybe a POST request to the AI handler with a GET request to the database nested inside?
router.get("/ai_chat", (req, res) => {
    res.render("partials/aiChat");
})

// can this be the same as the dashboard? any extra info?
router.get("/profile", (req, res) => {
    res.render("partials/profile");
})

// update username/password/first name/last name/etc
// query for single user who is logged in
router.get("/settings/:id", (req, res) => {
  db.User.findOne({
    where: {
      id:req.params.id
    }
  }).then(dbUser => {
    // take data that is an object with all of the users associations, turn it into JSON
    const userJson = userData.toJSON();
    // make an object that is just the username and password for editing?
    const hbsObj = {
      username:userJson.username,
      password:userJson.password
    }
    //pass that object to the frontend
    res.render("partials/settings", hbsObj);
  }).catch(err => {
    res.status(500).json(err)
  })
})

// Export routes for server.js to use.
module.exports = router;

//login js file

// $("#login").submit(event=>{
//   event.preventDefault();
//   $.post("/login",{
//     username:$("#username").val(),
//     password:$("#password").val()
//   }).then(data => {
//     console.log("Signed up!");
//     window.location.href = '/'
//   }).fail(err => {
//     console.log("Signup failed!");
//     console.log(err);
//     alert("signup failed")
//   })
// })

// $("#addReview").submit(event => {
//   event.preventDefault();
//   $.post('api/reviews', {
//     title: $("#title").val(),
//     reviews:$("#review").val(),
//     score:$("#scpre").val()
//   }).then(data => {
//     window.location.href = '/'
//   }).fail(err => {
//     alert("review failed")
//   })
// })


// router.get('/login', (req,res) => {
//   res.render('login')
// })

// db.Review.findAll().then(data => {
//   const jsonData = data.map(element => element.toJSON())
//   const hbsObj = {
//     reviews:jsonData
//   }
//   res.render('index',hbsObj)
// })