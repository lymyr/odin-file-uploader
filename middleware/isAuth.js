export default (req, res, next) => {
    if (!req.isAuthenticated())
        return res.render('index')
    next()
}