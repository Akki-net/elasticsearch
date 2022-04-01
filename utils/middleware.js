const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if (error.name === 'ValidationError') {
        return res.status(400).send({ error: 'Invalid args' })
    }
    else if(error.name === 'ReferenceError') {
        return res.status(400).send({ error: 'reference error' })
    }

    next(error)
}

module.exports = { unknownEndpoint, errorHandler }