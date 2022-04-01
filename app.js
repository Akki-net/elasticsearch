const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { requestLogger } = require('./utils/requestLogger')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')
const elasticRouter = require('./routes/elastic')

app.use(express.json())
app.use(requestLogger)


mongoose.connect('mongodb://localhost:27017/ImagesbazaarDB_MongoDBv2')
    .then(result => {
        console.log('connected to mongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.get('/', (req, res) => {
    res.status(200).send("<h1>my name is akash</h1>")
})

app.use('/elasticsearch', elasticRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app