const elasticRouter = require('express').Router()
const { searchByText, simpleSearch ,addBulk, createIndex, info, deleteIndex, documentAdd, documentShow, documentDel } = require('../controllers/elastic')

elasticRouter.get('/info', info)
elasticRouter.get('/createIndex/:index', createIndex)
elasticRouter.get('/deleteIndex/:index', deleteIndex)
elasticRouter.post('/documentAdd', documentAdd)
elasticRouter.get('/documentShow/:index/:type', documentShow)
elasticRouter.get('/documentDel/:index/:type/:id', documentDel)
elasticRouter.get('/addBulk', addBulk)
elasticRouter.get('/simpleSearch', simpleSearch)
elasticRouter.get('/searchByText/:keyword', searchByText)

module.exports = elasticRouter