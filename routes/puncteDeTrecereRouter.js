const puncteDeTrecereController = require('../controllers/puncteDeTrecereController');
const {authorizeAdmin, authenticateToken, filterDeletedRecords} = require("../middlewares/authMiddleware");
const { puncteDeTrecere } = require("../models");

const routerPuncteDeTrecere = require('express').Router();
routerPuncteDeTrecere.use(filterDeletedRecords(puncteDeTrecere));

routerPuncteDeTrecere.get('/allPuncteDeTrecere',authenticateToken, authorizeAdmin, puncteDeTrecereController.getAllPuncteDeTrecere);
routerPuncteDeTrecere.post('/addPunctDeTrecere',authenticateToken, authorizeAdmin, puncteDeTrecereController.addPunctDeTrecere);


routerPuncteDeTrecere.get('/:adresa',authenticateToken, authorizeAdmin, puncteDeTrecereController.getPunctDeTrecereByAdress);

routerPuncteDeTrecere.put('/:adresa',authenticateToken, authorizeAdmin, puncteDeTrecereController.updatePunctDeTrecere);
routerPuncteDeTrecere.delete('/:adresa',authenticateToken, authorizeAdmin, puncteDeTrecereController.deletePunctDeTrecere);

routerPuncteDeTrecere.get('/:adresa/agenti',authenticateToken, authorizeAdmin, puncteDeTrecereController.getAgentsByPunctDeTrecere);
routerPuncteDeTrecere.get('/info/TimpMediu',authenticateToken, authorizeAdmin, puncteDeTrecereController.getTimpMediuPuncteTrecere);

module.exports = routerPuncteDeTrecere;
