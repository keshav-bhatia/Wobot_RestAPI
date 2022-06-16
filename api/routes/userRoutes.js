const express = require('express');
const router = express.Router();
const userComponents = require('../components/user');

router.post('/signup',userComponents.signup);

router.post('/login',userComponents.login);


module.exports = router;
