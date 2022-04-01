const elasticRouter = require('express').Router()
const { createIndex, info, deleteIndex, documentAdd, documentShow } = require('../controllers/elastic')

elasticRouter.get('/info', info)
elasticRouter.get('/createIndex/:index', createIndex)
elasticRouter.get('/deleteIndex/:index', deleteIndex)
elasticRouter.post('/documentAdd', documentAdd)
elasticRouter.get('/documentShow/:index/:type', documentShow)

module.exports = elasticRouter