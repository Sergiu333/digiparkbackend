const camionController = require('../controllers/camionController')
const { authenticateToken, filterDeletedRecords} = require('../middlewares/authMiddleware');
const { camioane } = require("../models");

const routerCamioane = require('express').Router()
routerCamioane.use(filterDeletedRecords(camioane));

routerCamioane.post('/addCamion',authenticateToken, camionController.addCamion)
routerCamioane.get('/allCamions',authenticateToken, camionController.getAllCamion)
routerCamioane.get('/succes',authenticateToken, camionController.getSuccessCamions)
routerCamioane.get('/:id',authenticateToken, camionController.getCamion)
routerCamioane.put('/:id',authenticateToken, camionController.updateCamion)
routerCamioane.delete('/:id',authenticateToken, camionController.deleteCamion)
routerCamioane.get('/agent/:email',authenticateToken, camionController.getCamioaneByAgentEmail)
routerCamioane.get('/vama/:vama/:userEmail', authenticateToken, camionController.getCamioaneByVama);
routerCamioane.get('/camioane/adresaTrecere/:adresa',authenticateToken, camionController.getCamioaneByAdresaTrecere)
routerCamioane.get('/camioane/adresaDevamare/:adresa',authenticateToken, camionController.getCamioaneByAdresaDevamare)
routerCamioane.get('/camioane/:vama/:excludeAdresa',authenticateToken, camionController.getCamioaneByVamaExcludeAdresa)

module.exports = routerCamioane

