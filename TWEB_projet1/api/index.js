const express = require('express');
const Github = require('./Github');
const utils = require('./utils');

const router = express.Router();
const client = new Github({ token: process.env.OAUTH_TOKEN });

router.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});

router.get('/languages/:username', (req, res, next) => {
  client.userLanguages(req.params.username)
    .then(utils.getReposLanguagesStats)
    .then(stats => res.send(stats))
    .catch(next);
});

module.exports = router;
