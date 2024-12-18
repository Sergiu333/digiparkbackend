const express = require('express');
const userController = require('../controllers/userController');
const { filterDeletedRecords, authenticateToken } = require('../middlewares/authMiddleware');
const { user } = require("../models");

const routerUser = express.Router();

routerUser.use(filterDeletedRecords(user));

routerUser.post('/register', userController.registerUser);
routerUser.post('/login', userController.loginUser);

routerUser.get('/getAllUsers', authenticateToken, userController.getAllUsers);

module.exports = routerUser;
