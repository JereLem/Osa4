const bcrypt = require('bcrypt');
const express = require('express');

const { Token } = require('../utils/login');
const User = require('../models/usermodel');

const loginrouter = express.Router();

loginrouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect))
    return res.status(401).json({
      error: 'invalid username or password',
    });

  const token = Token(user);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginrouter;