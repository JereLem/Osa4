const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');

const Token = (user) =>
  jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    SECRET,
    { expiresIn: 60 * 60 }
  );

module.exports = {
  Token,
};