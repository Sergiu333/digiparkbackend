const express = require('express');
const authController = require('../controllers/authController');

const routerAuth = express.Router();

routerAuth.post('/login', authController.login);

module.exports = routerAuth;
