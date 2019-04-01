module.exports = {
    authorization: function(req, res, next) {
        if (req.authenticatedUser.role !== 'admin') {
            res.status(401).json({ msg: 'Not authorized'})
        } else {
            next()
        }
    }
}