// routing code for backend HTTP requests

// required modules for publishers.js
const passport = require('passport');
const settings = require('../config/passport.js')(passport);
const jwt = require('jsonwebtoken');
const router = require('express').Router();

// Linked model for 'users'
let User = require('../models/User');

router.post('/register', (req, res) => {
	const { body } = req;
	const { password } = body;
	let { email } = body;

	if (!email) {
		return res.json({
			success: false,
			message: 'Error Password cannot be blank.'
		});
	}

	if (!password) {
		return res.json({
			success: false,
			message: 'Error Password cannot be blank.'
		});
	}
	email = email.toLowerCase();
	email = email.trim();

	User.find({ email: email }, (err, previousUsers) => {
		if (err) {
			return res.json({ success: false, message: 'Error: Server Error!' });
		} else if (previousUsers.length > 0) {
			return res.json({
				success: false,
				message: 'Error: Account already exists!'
			});
		}

		// save user
		const newUser = new User();
		newUser.email = email;
		newUser.password = newUser.generateHash(password);
		newUser.save((err, user) => {
			if (err) {
				return res.json({ success: false, message: 'Error: Server Error!' });
			}
			return res.json({ success: true, message: 'Account created for user' });
		});
	});
});

router.post('/login', function(req, res) {
	const { body } = req;
	const { password } = body;
	let { email } = body;

	if (!email) {
		return res.json({
			success: false,
			message: 'Error Password cannot be blank.'
		});
	}
	if (!password) {
		return res.json({
			success: false,
			message: 'Error Password cannot be blank.'
		});
	}
	email = email.toLowerCase().trim();

	User.findOne({ email }, function(err, user) {
		if (err) throw err;
		if (!user) {
			res
				.status(401)
				.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
		} else {
			if (user.validPassword(password)) {
				let token = jwt.sign(user.toJSON(), process.env.API_SECRET);
				res.json({ success: true, token: 'JWT ' + token });
			} else {
				res
					.staus(401)
					.json({
						success: false,
						message: 'Authentication failed. Wrong Password'
					});
			}
		}
	});
});

module.exports = router;
