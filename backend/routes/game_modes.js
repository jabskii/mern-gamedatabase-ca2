const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport.js')(passport);

let Game_modes = require('../models/Game_modes');

const getToken = headers => {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

router.route('/').get((req, res) => {
  Game_modes.find()
    .then(game_mode => res.json(game_mode))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  const game_modeId = req.params.id;

  Game_modes.findById(game_modeId)
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: 'Game_modes not found with id ' + game_modeId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          message: 'Game_modes not found with id ' + game_modeId
        });
      }
      return res.status(500).json({
        message: 'Error retrieving game_mode with id ' + game_modeId
      });
    });
});

router.route('/').post(
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const game_mode = req.body;
    //validate game_mode
    if (token) {
      if (!game_mode.name) {
        return res.status(400).json({
          message: 'Game_modes name can not be empty'
        });
      }

      const newGame_modes = new Game_modes(game_mode);
      console.log(newGame_modes);
      newGame_modes
        .save()
        .then(data => {
          res.json(data);
        })
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.'
      });
    }
  }
);

router.route('/:id').put(
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const game_modeId = req.params.id;
    const newGame_modes = req.body;
    if (token) {
      if (!newGame_modes.name) {
        return res.status(400).json({
          message: 'Game_modes name can not be empty'
        });
      }

      // Find game_mode and update it with the request body
      Game_modes.findByIdAndUpdate(game_modeId, newGame_modes, {
        new: true
      })
        .then(game_mode => {
          if (!game_mode) {
            return res.status(404).json({
              message: 'Game_modes not found with id ' + game_modeId
            });
          }
          res.json(game_mode);
        })
        .catch(err => {
          if (err.kind === 'ObjectId') {
            return res.status(404).json({
              message: 'Game_modes not found with id ' + game_modeId
            });
          }
          return res.status(500).json({
            message: 'Error updating game_mode with id ' + game_modeId
          });
        });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  }
);

router.route('/:id').delete(
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const game_modeId = req.params.id;
    if (token) {
      Game_modes.findByIdAndRemove(game_modeId)
        .then(game_mode => {
          if (!game_mode) {
            return res.status(404).json({
              message: 'Game_modes not found with id ' + game_modeId
            });
          }
          res.json({
            message: 'Game_modes deleted successfully!'
          });
        })
        .catch(err => {
          if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
              message: 'Game_modes not found with id ' + game_modeId
            });
          }
          return res.status(500).send({
            message: 'Could not delete game_mode with id ' + game_modeId
          });
        });
    } else {
      return res.status(403).json({
        success: false,
        messsage: 'Unuthorized'
      });
    }
  }
);

module.exports = router;
