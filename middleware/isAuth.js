export default (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.session.messages)
            return res.render('index', {loginErr: req.session.messages[req.session.messages.length-1]})
        return res.render('index')
    }
    next()
}