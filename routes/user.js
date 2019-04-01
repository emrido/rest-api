const express = require('express');
const router = express.Router();
const UserController = require('../controller/user');
const { authentication, authorization } = require('../middleware');


router.get('/', authorization, UserController.list);
router.post('/', UserController.add);
router.get('/:id', UserController.read);
router.delete('/:id', authorization, UserController.remove);
router.put('/:id', UserController.update);

module.exports = router;