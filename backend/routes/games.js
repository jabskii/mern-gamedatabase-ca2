// routing code for backend HTTP requests

// required modules for games.js
const router = require('express').Router();
const passport = require('passport');
const settings = require('../config/passport.js')(passport);

// Linked model for 'games'
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

// HTTP GET request for all games. Also populates object IDs from different models other than 'games'
router.route('/').get((req, res) => {
	Game.find()
		.populate('developer_id')
		.populate('publisher_id')
		.populate('genre_id')
		.populate('platform_id')
		.populate('game_mode_id')
		.then(games => res.json(games))
		.catch(err => res.status(400).json('Error: ' + err));
});

// HTTP GET request but for Show views in REACT. This will get a game ID to show objects
router.route('/:id').get((req, res) => {
	const gameId = req.params.id;

	Game.findById(gameId)
		.populate('developer_id')
		.populate('publisher_id')
		.populate('genre_id')
		.populate('platform_id')
		.populate('game_mode_id')
		.then(result => {
			if (!result) {
				return res
					.status(404)
					.json({ message: 'Game not found with id ' + gameId });
			}
			res.json(result);
		})
		.catch(err => {
			if (err.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ message: 'Game not found with id ' + gameId });
			}
			return res
				.status(500)
				.json({ message: 'Error retrieving game with id ' + gameId });
		});
});

// HTTP POST request for Create game. Validation is in place with IGDB_ID and TITLE
router
	.route('/')
	.post(passport.authenticate('jwt', { session: false }), (req, res) => {
		const token = getToken(req.headers);
		const game = req.body;
		//validate game
		if (token) {
			if (!game.igdb_id) {
				return res
					.status(400)
					.json({ message: 'Game IGDB_ID can not be empty' });
			}
			if (!game.title) {
				return res.status(400).json({ message: 'Game title can not be empty' });
			}

			const newGame = new Game(game);
			console.log(newGame);
			newGame
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
		const gameId = req.params.id;
		const newGame = req.body;
		if (token) {
			if (!game.igdb_id) {
				return res
					.status(400)
					.json({ message: 'Game IGDB_ID can not be empty' });
			}
			if (!game.title) {
				return res.status(400).json({ message: 'Game title can not be empty' });
			}

			// Find Game and update it with the request body
			Game.findByIdAndUpdate(gameId, newGame, { new: true })
				.then(game => {
					if (!game) {
						return res
							.status(404)
							.json({ message: 'Game not found with id ' + gameId });
					}
					res.json(game);
				})
				.catch(err => {
					if (err.kind === 'ObjectId') {
						return res
							.status(404)
							.json({ message: 'Game not found with id ' + gameId });
					}
					return res
						.status(500)
						.json({ message: 'Error updating game with id ' + gameId });
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
		const gameId = req.params.id;
		if (token) {
			Game.findByIdAndRemove(gameId)
				.then(game => {
					if (!game) {
						return res
							.status(404)
							.json({ message: 'game not found with id ' + gameId });
					}
					res.json({ message: 'Game deleted successfully!' });
				})
				.catch(err => {
					if (err.kind === 'ObjectId' || err.name === 'NotFound') {
						return res
							.status(404)
							.json({ message: 'Game not found with id ' + gameId });
					}
					return res
						.status(500)
						.send({ message: 'Could not delete game with id ' + gameId });
				});
		} else {
			return res.status(403).json({ success: false, messsage: 'Unauthorized' });
		}
	});

module.exports = router;
