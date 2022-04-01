const elasticRouter = require('express').Router()
const { createIndex, info, deleteIndex } = require('../controllers/elastic')

elasticRouter.get('/info', info)
elasticRouter.get('/createIndex/:index', createIndex)
elasticRouter.get('/deleteIndex/:index', deleteIndex)

module.exports = elasticRouter