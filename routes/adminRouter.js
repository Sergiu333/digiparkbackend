const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin, filterDeletedRecords} = require('../middlewares/authMiddleware');
const { admin } = require("../models");

const routerAdmin = express.Router();
routerAdmin.use(filterDeletedRecords(admin));

routerAdmin.post('/addAdmin', authenticateToken, authorizeAdmin, adminController.addAdmin);
routerAdmin.get('/getAllAdmins', authenticateToken, authorizeAdmin, adminController.getAllAdmins);
routerAdmin.get('/:Email', authenticateToken, authorizeAdmin, adminController.getAdmin);
routerAdmin.put('/:Email', authenticateToken, authorizeAdmin, adminController.updateAdmin);
routerAdmin.delete('/:Email', authenticateToken, authorizeAdmin, adminController.deleteAdmin);

module.exports = routerAdmin;
