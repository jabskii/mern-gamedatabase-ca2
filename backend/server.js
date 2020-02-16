// backend code

// required modules for server.js
const express = require('express');
const body_parser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000; // the server will listen on port 5000

// middleware init module
const cors = require('cors');
require('dotenv').config(); // loads the .env file configs

// MONGODB init modules
const mongoose = require('mongoose');
const ATLAS_URI = process.env.ATLAS_URI; // reads the config from .env file

// routers for API
const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games');
const developersRouter = require('./routes/developers');
const publishersRouter = require('./routes/publishers');
const genresRouter = require('./routes/genres');
const platformsRouter = require('./routes/platforms');
const game_modesRouter = require('./routes/game_modes');

app.use(body_parser.json()); // body parsing middleware, json parse the body of all incoming requests
app.use(cors()); // skips the same-origin policy and access resources from remote hosts

// MongoDB connect method
mongoose.connect(
  ATLAS_URI,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  // callback execution to mongoDB
  function(err) {
    if (err) {
      throw err;
    } else {
      console.log('MongoDB database connection established successfully');
    }
  }
);

app.get('/', (req, res) => {
  res.json({ message: 'You are in the root route' });
});

app.use('/account', usersRouter);
app.use('/games', gamesRouter);
app.use('/developers', developersRouter);
app.use('/publishers', publishersRouter);
app.use('/genres', genresRouter);
app.use('/platforms', platformsRouter);
app.use('/game_modes', game_modesRouter);

// logs the listening port
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
