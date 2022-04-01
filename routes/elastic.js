const elasticRouter = require('express').Router()
const { create, info } = require('../controllers/elastic')

elasticRouter.get('/info', info)
elasticRouter.get('/create/:index', create)

module.exports = elasticRouter