// routing code for backend HTTP requests

// required modules for developers.js
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport.js')(passport);

// Linked model for 'developers'
let Developer = require('../models/Developer');
let Game = require('../models/Game');

// Authentication getToken code for secure CRUD
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

// HTTP GET request for all developers. Also populates object IDs from different models other than 'games'
router.route('/').get((req, res) => {
	Developer.find()
		.populate('games')
		.then(developers => res.json(developers))
		.catch(err => res.status(400).json('Error: ' + err));
});

// HTTP GET request but for Show views in REACT. This will get a game ID to show objects
router.route('/:id').get((req, res) => {
	const developerId = req.params.id;

	Developer.findById(developerId)
		.populate('games')
		.then(result => {
			if (!result) {
				return res
					.status(404)
					.json({ message: 'Developer not found with id ' + developerId });
			}
			res.json(result);
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ message: 'Developer not found with id ' + developerId });
			}
			return res
				.status(500)
				.json({ message: 'Error retrieving developer with id ' + developerId });
		});
});

// HTTP POST request for Create developer. Validation is in place with IGDB_ID and NAME
router
	.route('/')
	.post(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const developer = req.body;
		//validate developer
		if (token) {
			if (!developer.igdb_id) {
				return res
					.status(400)
					.json({ message: 'Developer IGDB_ID can not be empty' });
			}
			if (!developer.name) {
				return res
					.status(400)
					.json({ message: 'Developer name can not be empty' });
			}

			const newDeveloper = new Developer(developer);
			console.log(newDeveloper);
			newDeveloper
				.save()
				.then(data => {
					res.json(data);
				})
				.catch(err => res.status(400).json('Error: ' + err));
		} else {
			return res.status(403).json({ success: false, message: 'Unauthorized.' });
		}
	});

// HTTP PUT Request for Update view. Also with validation in place on IGDB_ID and TITLE
router
	.route('/:id')
	.put(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const developerId = req.params.id;
		const newDeveloper = req.body;
		if (token) {
			if (!developer.igdb_id) {
				return res
					.status(400)
					.json({ message: 'Developer IGDB_ID can not be empty' });
			}
			if (!developer.name) {
				return res
					.status(400)
					.json({ message: 'Developer name can not be empty' });
			}

			// Find Developer and update it with the request body
			Developer.findByIdAndUpdate(developerId, newDeveloper, {
				new: true
			})
				.then(developer => {
					if (!developer) {
						return res
							.status(404)
							.json({ message: 'Developer not found with id ' + developerId });
					}
					res.json(developer);
				})
				.catch(err => {
					if (err.kind === 'ObjectId') {
						return res
							.status(404)
							.json({ message: 'Developer not found with id ' + developerId });
					}
					return res.status(500).json({
						message: 'Error updating developer with id ' + developerId
					});
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
		const developerId = req.params.id;
		if (token) {
			Developer.findByIdAndRemove(developerId)
				.then(developer => {
					if (!developer) {
						return res
							.status(404)
							.json({ message: 'Developer not found with id ' + developerId });
					}
					res.json({ message: 'Developer deleted successfully!' });
				})
				.catch(err => {
					if (err.kind === 'ObjectId' || err.name === 'NotFound') {
						return res
							.status(404)
							.json({ message: 'Developer not found with id ' + developerId });
					}
					return res.status(500).send({
						message: 'Could not delete developer with id ' + developerId
					});
				});
		} else {
			Game.findByIdAndRemove({ developer_id: developerId }).exec();

			return res.status(403).json({ success: false, messsage: 'Unuthorized' });
		}
	});

module.exports = router;
