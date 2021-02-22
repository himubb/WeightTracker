const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((request, response) => {
  User.find()
    .then(users => response.json(users))
    .catch(error => response.status(400).json("Error:" + error));
});

router.route("/add").post((request, response) => {
  const username = request.body.username;
  console.log("username is " + username);
  const newUser = new User({ username });

  newUser
    .save()
    .then(() => response.json("User added successfully"))
    .catch(error => response.status(400).json("Error:" + error));
});

module.exports = router;
