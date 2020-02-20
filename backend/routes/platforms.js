// routing code for backend HTTP requests

// required modules for platforms.js
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

// Linked model for 'platforms'
let Platform = require('../models/Platform');
let Game = require('../models/Game');

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

// These HTTP REQUESTS below will retrive the bearer token to make the requests work

// HTTP GET request for all platforms. Also populates object IDs from different models other than 'games'
router.route('/').get((req, res) => {
	Platform.find()
		.populate('games')
		.then(platforms => res.json(platforms))
		.catch(err => res.status(400).json('Error: ' + err));
});

// HTTP GET request but for Show views in REACT. This will get a game ID to show objects
router.route('/:id').get((req, res) => {
	const platformId = req.params.id;

	Platform.findById(platformId)
		.populate('games')
		.then(result => {
			if (!result) {
				return res
					.status(404)
					.json({ message: 'Platform not found with id ' + platformId });
			}
			res.json(result);
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ message: 'Platform not found with id ' + platformId });
			}
			return res
				.status(500)
				.json({ message: 'Error retrieving Platform with id ' + platformId });
		});
});

// HTTP POST request for Create platoforms. Validation is in place with NAME
router
	.route('/')
	.post(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const platform = req.body;
		//validate platform
		if (token) {
			if (!platform.name) {
				return res
					.status(400)
					.json({ message: 'platform name can not be empty' });
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
			return res.status(403).json({ success: false, message: 'Unauthorized.' });
		}
	});

// HTTP PUT Request for Update view. Also with validation in place on NAME
router
	.route('/:id')
	.put(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const platformId = req.params.id;
		const newPlatform = req.body;
		if (token) {
			if (!newPlatform.name) {
				return res
					.status(400)
					.json({ message: 'Platform name can not be empty' });
			}

			// Find Platform and update it with the request body
			Platform.findByIdAndUpdate(platformId, newPlatform, { new: true })
				.then(platform => {
					if (!platform) {
						return res
							.status(404)
							.json({ message: 'Platform not found with id ' + platformId });
					}
					res.json(platform);
				})
				.catch(err => {
					if (err.kind === 'ObjectId') {
						return res
							.status(404)
							.json({ message: 'platform not found with id ' + platformId });
					}
					return res
						.status(500)
						.json({ message: 'Error updating platform with id ' + platformId });
				});
		} else {
			return res.status(403).json({ success: false, message: 'Unauthorized' });
		}
	});

// HTTP DELETE Request for deletion of an object by finding the object's ID
router
	.route('/:id')
	.delete(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const platformId = req.params.id;
		if (token) {
			Platform.findByIdAndRemove(platformId)
				.then(platform => {
					if (!platform) {
						return res
							.status(404)
							.json({ message: 'Platform not found with id ' + platformId });
					}
					res.json({ message: 'Platform deleted successfully!' });
				})
				.catch(err => {
					if (err.kind === 'ObjectId' || err.name === 'NotFound') {
						return res
							.status(404)
							.json({ message: 'Platform not found with id ' + platformId });
					}
					return res.status(500).send({
						message: 'Could not delete platform with id ' + platformId
					});
				});
		} else {
			Game.findByIdAndRemove({ platform_id: platformId }).exec();

			return res.status(403).json({ success: false, messsage: 'Unuthorized' });
		}
	});

module.exports = router;
