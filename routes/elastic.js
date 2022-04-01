const elasticRouter = require('express').Router()
const { createIndex, info, deleteIndex, documentAdd } = require('../controllers/elastic')

elasticRouter.get('/info', info)
elasticRouter.get('/createIndex/:index', createIndex)
elasticRouter.get('/deleteIndex/:index', deleteIndex)
elasticRouter.post('/documentAdd', documentAdd)

module.exports = elasticRouter