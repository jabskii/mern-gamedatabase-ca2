// routing code for backend HTTP requests

// required modules for genres.js
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport')(passport);

// Linked model for 'game_modes'
let Genre = require('../models/Genre');
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

// HTTP GET request for all genres. Also populates object IDs from different models other than 'games'
router.route('/').get((req, res) => {
	Genre.find()
		.populate('games')
		.then(genres => res.json(genres))
		.catch(err => res.status(400).json('Error: ' + err));
});

// HTTP GET request but for Show views in REACT. This will get a game ID to show objects
router.route('/:id').get((req, res) => {
	const genreId = req.params.id;

	Genre.findById(genreId)
		.populate('games')
		.then(result => {
			if (!result) {
				return res
					.status(404)
					.json({ message: 'genre not found with id ' + genreId });
			}
			res.json(result);
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ message: 'genre not found with id ' + genreId });
			}
			return res
				.status(500)
				.json({ message: 'Error retrieving genre with id ' + genreId });
		});
});

// HTTP POST request for Create genres. Validation is in place with NAME
router
	.route('/')
	.post(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const genre = req.body;
		//validate genre
		if (token) {
			if (!genre.name) {
				return res.status(400).json({ message: 'genre name can not be empty' });
			}

			const newGenre = new Genre(genre);
			console.log(newGenre);
			newGenre
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
		const genreId = req.params.id;
		const newGenre = req.body;
		if (token) {
			if (!newGenre.name) {
				return res.status(400).json({ message: 'Genre name can not be empty' });
			}

			// Find Genre and update it with the request body
			Genre.findByIdAndUpdate(genreId, newGenre, { new: true })
				.then(genre => {
					if (!genre) {
						return res
							.status(404)
							.json({ message: 'genre not found with id ' + genreId });
					}
					res.json(genre);
				})
				.catch(err => {
					if (err.kind === 'ObjectId') {
						return res
							.status(404)
							.json({ message: 'genre not found with id ' + genreId });
					}
					return res
						.status(500)
						.json({ message: 'Error updating genre with id ' + genreId });
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
		const genreId = req.params.id;
		if (token) {
			Genre.findByIdAndRemove(genreId)
				.then(genre => {
					if (!genre) {
						return res
							.status(404)
							.json({ message: 'genre not found with id ' + genreId });
					}
					res.json({ message: 'genre deleted successfully!' });
				})
				.catch(err => {
					if (err.kind === 'ObjectId' || err.name === 'NotFound') {
						return res
							.status(404)
							.json({ message: 'genre not found with id ' + genreId });
					}
					return res
						.status(500)
						.send({ message: 'Could not delete genre with id ' + genreId });
				});
		} else {
			Game.findByIdAndRemove({ genre_id: genreId }).exec();

			return res.status(403).json({ success: false, messsage: 'Unuthorized' });
		}
	});

module.exports = router;
