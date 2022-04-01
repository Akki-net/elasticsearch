exports.requestLogger = (req, res, next) => {
    console.log('method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', req.body)
    console.log('----')
    next()
}