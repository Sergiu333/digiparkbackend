const puncteDeDevamareController = require('../controllers/punctDeDevamareController')
const {authorizeAdmin, authenticateToken, filterDeletedRecords} = require("../middlewares/authMiddleware");
const { puncteDeDevamare } = require("../models");

const routerPuncteDeDevamare = require('express').Router()
routerPuncteDeDevamare.use(filterDeletedRecords(puncteDeDevamare));

routerPuncteDeDevamare.post('/addPunctDeDevamare',authenticateToken, authorizeAdmin,  puncteDeDevamareController.addPunctDeDevamare);
routerPuncteDeDevamare.get('/allPuncteDeDevamare',authenticateToken, authorizeAdmin,  puncteDeDevamareController.getAllPuncteDevamare);
routerPuncteDeDevamare.get('/:locatia',authenticateToken, authorizeAdmin,  puncteDeDevamareController.getPunctDeDevamareByAdress);
routerPuncteDeDevamare.put('/:locatia',authenticateToken, authorizeAdmin,  puncteDeDevamareController.updatePunctDeDevamare);
routerPuncteDeDevamare.delete('/:locatia',authenticateToken, authorizeAdmin,  puncteDeDevamareController.deletePunctDeDevamare);

routerPuncteDeDevamare.get('/:adresa/agenti',authenticateToken, authorizeAdmin, puncteDeDevamareController.getAgentsByPunctDeDevamare);
routerPuncteDeDevamare.get('/info/TimpMediu',authenticateToken, authorizeAdmin, puncteDeDevamareController.getTimpMediuPuncteDevamare);

module.exports = routerPuncteDeDevamare
