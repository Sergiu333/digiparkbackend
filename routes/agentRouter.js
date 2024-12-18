const express = require('express');
const agentController = require('../controllers/agentController');
const { authenticateToken, filterDeletedRecords} = require('../middlewares/authMiddleware');
const { agenti } = require("../models");

const routerAgent = express.Router();
routerAgent.use(filterDeletedRecords(agenti));

routerAgent.post('/addAgent', authenticateToken, agentController.addAgent);
routerAgent.get('/getAllAgents', authenticateToken, agentController.getAllAgents);
routerAgent.get('/:email', authenticateToken, agentController.getAgent);
routerAgent.put('/:email', authenticateToken, agentController.updateAgent);
routerAgent.delete('/:email', authenticateToken, agentController.deleteAgent);

routerAgent.get('/punctVama/:adresa', authenticateToken, agentController.getAgentsByVama)
routerAgent.get('/punctDevamare/:adresa', authenticateToken, agentController.getAgentsByDevamare)
routerAgent.get('/info/getAgentInfo', authenticateToken, agentController.getAgentInfo)

module.exports = routerAgent;
