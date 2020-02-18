const router = require("express").Router();
const passport = require("passport");
const settings = require("../config/passport")(passport);

const getToken = headers => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

let Genre = require("../models/Genre");

router.route("/").get((req, res) => {
  Genre.find()
    .populate("games")
    .then(genres => res.json(genres))
    .catch(err => res.status(400).json("Error: " + err));

  // res.json(genres);
});

router.route("/:id").get((req, res) => {
  const genreId = req.params.id;

  Genre.findById(genreId)
    .populate("games")
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: "genre not found with id " + genreId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).json({
          message: "genre not found with id " + genreId
        });
      }
      return res.status(500).json({
        message: "Error retrieving genre with id " + genreId
      });
    });
});

router.route("/").post(
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const genre = req.body;
    //validate genre
    if (token) {
      if (!genre.name) {
        return res.status(400).json({
          message: "genre name can not be empty"
        });
      }

      const newGenre = new Genre(genre);
      console.log(newGenre);
      newGenre
        .save()
        .then(data => {
          res.json(data);
        })
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized."
      });
    }
  }
);

router.route("/:id").put(
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const genreId = req.params.id;
    const newGenre = req.body;
    if (token) {
      if (!newGenre.name) {
        return res.status(400).json({
          message: "Genre name can not be empty"
        });
      }

      // Find Genre and update it with the request body
      Genre.findByIdAndUpdate(genreId, newGenre, {
        new: true
      })
        .then(genre => {
          if (!genre) {
            return res.status(404).json({
              message: "genre not found with id " + genreId
            });
          }
          res.json(genre);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).json({
              message: "genre not found with id " + genreId
            });
          }
          return res.status(500).json({
            message: "Error updating genre with id " + genreId
          });
        });
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }
  }
);

router.route("/:id").delete(
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const genreId = req.params.id;
    if (token) {
      Genre.findByIdAndRemove(genreId)
        .then(genre => {
          if (!genre) {
            return res.status(404).json({
              message: "genre not found with id " + genreId
            });
          }
          res.json({
            message: "genre deleted successfully!"
          });
        })
        .catch(err => {
          if (err.kind === "ObjectId" || err.name === "NotFound") {
            return res.status(404).json({
              message: "genre not found with id " + genreId
            });
          }
          return res.status(500).send({
            message: "Could not delete genre with id " + genreId
          });
        });
    } else {
      return res.status(403).json({
        success: false,
        messsage: "Unuthorized"
      });
    }
  }
);

module.exports = router;
