const express = require('express');
const router = express.Router();
const userRoute = require('./user');
const UserController = require('../controller/user');
const { authentication, authorization } = require('../middleware');


router.post('/api/login', UserController.login);
router.post('/api/register', UserController.add);

router.use(authentication);
router.use('/api/users', userRoute);

module.exports = router;