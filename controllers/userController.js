const express = require("express");
const router = express.Router();
const db = require('../models')
const bcrypt = require('bcrypt')

// GET route for retrieving all users from USER table
router.get("/api/users", (req, res) => {
  db.User.findAll().then(dbUser => {
    res.json(dbUser);
  }).catch(err => {
    console.log(err.message);
    res.status(500).send(err.message);
  });
});

// allows user to signup for an account
router.post("/signup", (req, res) => {
  db.User.create({
    username: req.body.username,
    password: req.body.password
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).json(err)
  });
});

// allows user to login and saves their session
router.post("/login", (req, res) => {
  db.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(userData => {
    if (!userData) {
      req.session.destroy()
      res.status(404).send("No such user exists!")
    } else {
      if (bcrypt.compareSync(req.body.password, userData.password)) {
        req.session.user = {
          id: userData.id,
          username: userData.username
        }
        res.json(userData)
      } else {
        req.session.destroy()
        res.status(401).send("Wrong password")
      }
    }
  }).catch(err => {
    res.status(500).json(err)
  });
});

// PUT route to add connections, trigger each time a user is followed/friend/etc
router.put("/connect", (req, res) => {
  //TODO: if (req.session.user) {
    // find the logged in user
  db.User.findOne({
      where: {
        id: req.body.id // req.session.user.id for logged in user
      }
    }).then(dbUser => {
      // add the targeted user as an association
      dbUser.addAssociate(req.body.associateId)
      res.json(dbUser)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  //TODO: } else {
  //TODO:   res.status(401).send("Please login to access this page.")
  //TODO: }
})

// DELETE route to remove connections between users
router.delete("/disconnect", (req, res) => {
  //TODO: if (req.session.user) {
    // find the logged in user
  db.User.findOne({
      where: {
        id: req.body.id // req.session.user.id for logged in user
      }
    }).then(dbUser => {
      // add the targeted user as an association
      dbUser.removeAssociate(req.body.associateId)
      res.json(dbUser)
    }).catch(err => {
      console.log(err.message);
      res.status(500).send(err.message)
    })
  //TODO: } else {
  //TODO:   res.status(401).send("Please login to access this page.")
  //TODO: }
})

// allows user to update their username
router.put("/username/change", (req, res) => {
  if (req.session.user) {
    db.User.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(dbUser => {
        res.json(dbUser)
      }).catch(err => {
        console.log(err.message);
        res.status(500).send(err.message);
      });
  } else {
    res.status(401).send("Please login to access this page.")
  }
});

// just allows you to fetch the data to see if you are logged in
router.get("/readsessions", (req, res) => {
  res.json(req.session)
})

// gives access to pages if you are logged in
router.get("/secretclub", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to teh club, ${req.session.user.username}!`)
  } else {
    res.status(401).send("Please login to access this page.")
  }
});

// allows user to logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.send('Logged out')
});

// DELETE route for deleting user with a specific id, to terminate an account
// TODO: Future development - Delete flips a boolean to hide it and then checks daily until X days pass before being finally deleted
router.delete("/api/users/:id", (req, res) => {
  db.User.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbUser => {
    res.json(dbUser)
  }).catch(err => {
    console.log((err.message));
    res.status(500).send(err.message);
  });
});

// TODO: I wrote this twice?
// // route for connect/follow button
// router.get("/connect/:id", (req, res) => {
//   if (req.session.user) {
//     db.User.findOne({
//       where: {
//         id: req.session.user.id
//       }
//     }).then(userData => {
//       userData.addAssociate(req.params.id)
//       res.json(userData)
//     }).catch(err => {
//       res.status(500).send(err);
//     })
//   } else {
//     res.send("Please sign in.")
//   }
// })

module.exports = router;