const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport.js')(passport);

let Platform = require('../models/Platform');

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
  Platform.find()
    .then(platforms => res.json(platforms))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  const platformId = req.params.id;

  Platform.findById(platformId)
    .then(result => {
      if (!result) {
        return res.status(404).json({
          message: 'Platform not found with id ' + platformId
        });
      }
      res.json(result);
    })
    .catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).json({
          message: 'Platform not found with id ' + platformId
        });
      }
      return res.status(500).json({
        message: 'Error retrieving platform with id ' + platformId
      });
    });
});

router.route('/').post(
  passport.authenticate('jwt', {
    session: false
  }),
  (req, res) => {
    const token = getToken(req.headers);
    const platform = req.body;
    //validate platform
    if (token) {
      if (!platform.name) {
        return res.status(400).json({
          message: 'Platform name can not be empty'
        });
      }

      const newPlatform = new Platform(platform);
      console.log(newPlatform);
      newPlatform
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
    const platformId = req.params.id;
    const newPlatform = req.body;
    if (token) {
      if (!newPlatform.name) {
        return res.status(400).json({
          message: 'Platform name can not be empty'
        });
      }

      // Find platform and update it with the request body
      Platform.findByIdAndUpdate(platformId, newPlatform, {
        new: true
      })
        .then(platform => {
          if (!platform) {
            return res.status(404).json({
              message: 'Platform not found with id ' + platformId
            });
          }
          res.json(platform);
        })
        .catch(err => {
          if (err.kind === 'ObjectId') {
            return res.status(404).json({
              message: 'Platform not found with id ' + platformId
            });
          }
          return res.status(500).json({
            message: 'Error updating platform with id ' + platformId
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
    const platformId = req.params.id;
    if (token) {
      Platform.findByIdAndRemove(platformId)
        .then(platform => {
          if (!platform) {
            return res.status(404).json({
              message: 'Platform not found with id ' + platformId
            });
          }
          res.json({
            message: 'Platform deleted successfully!'
          });
        })
        .catch(err => {
          if (err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
              message: 'Platform not found with id ' + platformId
            });
          }
          return res.status(500).send({
            message: 'Could not delete platform with id ' + platformId
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
