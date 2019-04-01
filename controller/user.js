const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    static list(req, res) {
        User
            .findAll()
            .then(users => {
                if (users.length > 0) {
                    res.status(200).json(users);
                } else {
                    res.status(404).json({ msg: 'User not found' })
                }
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }

    static add(req, res) {
        User
            .create(req.body)
            .then(newUser => {
                res.status(201).json(newUser);
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }

    static read(req, res) {
        User
            .findByPk(req.params.id)
            .then(foundUser => {
                if (req.authenticatedUser.role !== 'admin' && req.authenticatedUser.id != req.params.id) {
                    throw new Error('Not authorized')
                }
                if (foundUser) {
                    res.status(200).json(foundUser);
                } else {
                    res.status(404).json({ msg: 'User not found' })
                }
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }

    static remove(req, res) {
        User
            .destroy({ where: { id: req.params.id } })
            .then(deletedUser => {
                if (deletedUser === 0) {
                    res.status(404).json({ msg: 'User not found' });
                } else {
                    res.status(200).json({ msg: 'User ' + req.params.id + ' deleted' });
                }
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }

    static update(req, res) {
        User
            .findByPk(req.params.id)
            .then(foundUser => {
                if (foundUser) {
                    if (req.authenticatedUser.role !== 'admin' && req.authenticatedUser.id !== req.params.id) {
                        throw new Error('Not authorized')
                    } else {
                        return foundUser.update(req.body);
                    }
                } else {
                    res.status(404).json({ msg: 'User not found' });
                }
            })
            .then(updatedUser => {
                res.status(200).json(updatedUser);
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }

    static login(req, res) {
        User
            .findOne({ where: { username: req.body.username } })
            .then(user => {
                if (!user) {
                    res.status(404).json({ msg: 'User not found' })
                } else {
                    if (bcrypt.compareSync(req.body.password, user.password)) {
                        const token = jwt.sign({
                            id: user.id,
                            username: user.username,
                            role: user.role
                        }, process.env.JWT_SECRET)
                        req.headers.token = token;
                        res.status(200).json({ msg: 'Log in succed', token: token })
                    } else {
                        res.status(401).json({ msg: 'Wrong password' })
                    }
                }
            })
            .catch(err => {
                res.status(500).json({ msg: err.message });
            })
    }
}

module.exports = UserController;