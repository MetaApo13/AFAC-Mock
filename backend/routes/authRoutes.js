const express = require('express');
const { registerUser, loginUser } = require('../auth/emailAuth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = (app) => {
  app.use('/auth', router);
};