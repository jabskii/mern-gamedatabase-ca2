// routing code for backend HTTP requests

// required modules for publishers.js
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

// Linked model for 'publishers'
let Publisher = require('../models/Publisher');
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

// HTTP GET request for all publishers. Also populates object IDs from different models other than 'games'
router.route('/').get((req, res) => {
	Publisher.find()
		.populate('games')
		.then(publishers => res.json(publishers))
		.catch(err => res.status(400).json('Error: ' + err));
});

// HTTP GET request but for Show views in REACT. This will get a game ID to show objects
router.route('/:id').get((req, res) => {
	const publisherId = req.params.id;

	Publisher.findById(publisherId)
		.populate('games')
		.then(result => {
			if (!result) {
				return res
					.status(404)
					.json({ message: 'Publisher not found with id ' + publisherId });
			}
			res.json(result);
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ message: 'Publisher not found with id ' + publisherId });
			}
			return res
				.status(500)
				.json({ message: 'Error retrieving publisher with id ' + publisherId });
		});
});

// HTTP POST request for Create publisher. Validation is in place with IGDB_ID and NAME
router
	.route('/')
	.post(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const publisher = req.body;
		//validate publisher
		if (token) {
			if (!publisher.igdb_id) {
				return res
					.status(400)
					.json({ message: 'Publisher igdb_id can not be empty' });
			}
			publisher;
			if (!publisher.name) {
				return res
					.status(400)
					.json({ message: 'Publisher name can not be empty' });
			}

			const newPublisher = new Publisher(publisher);
			newPublisher
				.save()
				.then(data => {
					res.json(data);
				})
				.catch(err => res.status(400).json('Error: ' + err));
		} else {
			return res.status(403).json({ success: false, message: 'Unauthorized.' });
		}
	});

// HTTP PUT Request for Update view. Also with validation in place on IGDB_ID and NAME
router
	.route('/:id')
	.put(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const publisherId = req.params.id;
		const newPublisher = req.body;
		if (token) {
			if (!newPublisher.name) {
				return res
					.status(400)
					.json({ message: 'Publisher name can not be empty' });
			}

			// Find Publisher and update it with the request body
			Publisher.findByIdAndUpdate(publisherId, newPublisher, { new: true })
				.then(publisher => {
					if (!publisher) {
						return res
							.status(404)
							.json({ message: 'Publisher not found with id ' + publisherId });
					}
					res.json(publisher);
				})
				.catch(err => {
					if (err.kind === 'ObjectId') {
						return res
							.status(404)
							.json({ message: 'publisher not found with id ' + publisherId });
					}
					return res.status(500).json({
						message: 'Error updating publisher with id ' + publisherId
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
		const publisherId = req.params.id;
		if (token) {
			Publisher.findByIdAndRemove(publisherId)
				.then(publisher => {
					if (!publisher) {
						return res
							.status(404)
							.json({ message: 'publisher not found with id ' + publisherId });
					}
					res.json({ message: 'publisher deleted successfully!' });
				})
				.catch(err => {
					if (err.kind === 'ObjectId' || err.name === 'NotFound') {
						return res
							.status(404)
							.json({ message: 'publisher not found with id ' + publisherId });
					}
					return res.status(500).send({
						message: 'Could not delete publisher with id ' + publisherId
					});
				});
		} else {
			Game.findByIdAndRemove({ publisher_id: publisherId }).exec();

			return res.status(403).json({ success: false, messsage: 'Unuthorized' });
		}
	});

module.exports = router;
