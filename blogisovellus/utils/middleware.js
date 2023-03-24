const logger = require('./logger')
const jwt = require('jsonwebtoken')

const errors = (error, re, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'invalid token'
        })
    }

    logger.error(error.message)
    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.headers.authorization
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req["token"] = authorization.substring(7)
    }
    next()
  }

const tokenValidator = (req, res, next) => {
    const authorization = req.headers.authorization
    let token

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    if (!token) {
        return res.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' })
    }
    next()
}

module.exports = { errors, tokenExtractor, tokenValidator }