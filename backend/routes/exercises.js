const router = require("express").Router();
let Exercise = require("../models/exercise.model");

router.route("/").get((request, response) => {
  Exercise.find()
    .then(exercises => response.json(exercises))
    .catch(error => response.status(400).json("Error:" + error));
});

router.route("/add").post((request, response) => {
  const username = request.body.username;
  const description = request.body.description;
  const duration = Number(request.body.duration);
  const date = Date.parse(request.body.date);
  const weight = Number(request.body.weight);

  const newExercise = new Exercise({
    username,
    description,
    duration,
    date,
    weight
  });

  newExercise
    .save()
    .then(() => response.json("Entry added successfully"))
    .catch(error => response.status(400).json("Error:" + error));
});
router.route("/:id").get((req, res) => {
  Exercise.findById(req.params.id)
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise deleted."))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  Exercise.findById(req.params.id)
    .then(exercise => {
      exercise.username = req.body.username;
      exercise.description = req.body.description;
      exercise.duration = Number(req.body.duration);
      exercise.date = Date.parse(req.body.date);
      exercise.weight = Number(req.body.weight);
      exercise
        .save()
        .then(() => res.json("Exercise updated!"))
        .catch(err => res.status(400).json("Error: " + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});
module.exports = router;
