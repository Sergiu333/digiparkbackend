const db = require('../models');
const bcrypt = require('bcrypt');
const Agent = db.agenti;

// Add agent
const addAgent = async (req, res) => {
    try {
        const existingAgent = await Agent.findOne({ where: { Email: req.body.Email } });

        if (existingAgent) {
            return res.status(400).json({ message: 'Email deja folosit de catre un agent/admin' });
        }

        let info = {
            Nume: req.body.Nume,
            Prenume: req.body.Prenume,
            Email: req.body.Email,
            Telefon: req.body.Telefon,
            Parola: await bcrypt.hash(req.body.Parola, 10),
            Locatia_punct_de_trecere: req.body.Locatia_punct_de_trecere,
            Data_nasterii: req.body.Data_nasterii,
            id_punct: req.body.id_punct,

        };

        // Create the agent entry in the database
        const agent = await Agent.create(info);

        // Send the response with the agent information (without the password)
        res.status(200).send({
            id_agent: agent.id_agent,
            Nume: agent.Nume,
            Prenume: agent.Prenume,
            Email: agent.Email,
            Telefon: agent.Telefon,
            Data_nasterii: agent.Data_nasterii,
            Locatia_punct_de_trecere: agent.Locatia_punct_de_trecere,
            id_punct: agent.id_punct
        });

        console.log(agent);
    } catch (error) {
        console.error('Eroare la adaugarea agentului', error);
        res.status(500).json({ message: 'Eroare la adaugarea agentului', error: error.message });
    }
};


const getAgentsByVama = async (req, res) => {
    try {
        const { adresa } = req.params; // Capture the adresa from the request parameters

        // Execute the query to find all agents based on the Adresa from punct_de_trecere
        const agents = await db.agenti.findAll({
            include: [
                {
                    model: db.puncteDeTrecere,
                    where: { Adresa: adresa }, // Filter by the Adresa
                    attributes: ['Adresa', 'Vama', 'Locatia_punct_de_trecere'], // Include any other attributes you want
                }
            ],
            attributes: ['id_agent', 'Nume', 'Prenume', 'Email', 'Telefon', 'Role'] // Select agent attributes
        });
        // Check if agents were found
        if (agents.length === 0) {
            return res.status(404).json({ message: `Nici un agent gasit la adresa ${adresa}` });
        }

        // Send the list of agents in the response
        res.status(200).json(agents);
    } catch (error) {
        console.error('Eroare la afisarea agentilor:', error);
        res.status(500).json({ message: 'Eroare la afisarea agentilor:', error: error.message });
    }
};


const getAgentsByDevamare = async (req, res) => {
    try {
        const { adresa } = req.params; // Capture the adresa from the request parameters

        // Execute the query to find all agents based on the Adresa from punct_de_trecere
        const agents = await db.agenti.findAll({
            include: [
                {
                    model: db.puncteDeDevamare,
                    where: { Adresa: adresa }, // Filter by the Adresa
                    attributes: ['Adresa', 'Locatia_punct_de_devamare'], // Include any other attributes you want
                }
            ],
            attributes: ['id_agent', 'Nume', 'Prenume', 'Email', 'Telefon', 'Role'] // Select agent attributes
        });

        // Check if agents were found
        if (agents.length === 0) {
            return res.status(404).json({ message: `Nici un agent gasit la adresa ${adresa}` });
        }

        // Send the list of agents in the response
        res.status(200).json(agents);
    } catch (error) {
        console.error('Eroare la afisarea agentilor:', error);
        res.status(500).json({ message: 'Eroare la afisarea agentilor:', error: error.message });
    }
};

// Get all agents
const getAllAgents = async (req, res) => {
    try {
        let agents = await Agent.findAll({
            include: [
                {

                    model: db.puncteDeTrecere,
                    attributes: ['Locatia_punct_de_trecere', 'Adresa', 'Vama']
                },
                {
                    model: db.puncteDeDevamare,
                    attributes: ['Locatia_punct_de_devamare', 'Adresa']
                }
            ],
            attributes: [
                'id_agent',
                'Nume',
                'Prenume',
                'Email',
                'Telefon',
                'Data_nasterii',
                'Role'
            ]
        });
        if (agents.length === 0) {
            return res.status(404).json({ message: 'Nu sunt agenti in baza de date' });
        }
        res.status(200).send(agents);
    } catch (error) {
        console.error('Eroare la afisarea agentilor:', error);
        res.status(500).json({ message: 'Eroare la afisarea agentilor:', error: error.message });
    }
};

// Get agent by email
const getAgent = async (req, res) => {
    try {
        let email = req.params.email;
        let agent = await Agent.findOne({
            where: {
                Email: email
            },
            include: [
                {
                    model: db.puncteDeTrecere,
                    attributes: ['Locatia_punct_de_trecere', 'Adresa', 'Vama']
                },
                {
                    model: db.puncteDeDevamare,
                    attributes: ['Locatia_punct_de_devamare', 'Adresa']
                }
            ],
            attributes: [
                'id_agent',
                'Nume',
                'Prenume',
                'Email',
                'Telefon',
                'Data_nasterii',
                'Locatia_punct_de_trecere',
                'Locatia_punct_de_devamare',
                'Role'
            ]
        });
        if (agent == null) {
            return res.status(404).json({ message: `Agentul cu emailul ${email} nu a fost gasit` });
        }
        res.status(200).send(agent);
    } catch (error) {
        console.error('Eroare la afisarea agentilor:', error);
        res.status(500).json({ message: 'Eroare la afisarea agentilor:', error: error.message });
    }
};

// Update agent


const updateAgent = async (req, res) => {
    try {
        const email = req.params.email;
        const updatedFields = req.body;


        if (updatedFields.Locatia_punct_de_trecere) {
            const punctTrecereExists = await db.puncteDeTrecere.findOne({
                where: {
                    Locatia_punct_de_trecere: updatedFields.Locatia_punct_de_trecere
                }
            });

            if (!punctTrecereExists) {
                return res.status(400).json({ message: `Punctul de trecere ${updatedFields.Locatia_punct_de_trecere} nu exista in baza de date` });
            }
        }


        if (updatedFields.Locatia_punct_de_devamare) {
            const punctDevamareExists = await db.puncteDeDevamare.findOne({
                where: {
                    Locatia_punct_de_devamare: updatedFields.Locatia_punct_de_devamare
                }
            });

            if (!punctDevamareExists) {
                return res.status(400).json({ message: `Punctul de trecere ${updatedFields.Locatia_punct_de_devamare} nu exista in baza de date` });
            }
        }


        if (updatedFields.Parola) {
            updatedFields.Parola = await bcrypt.hash(updatedFields.Parola, 10);
        }


        const updatedAgent = await db.agenti.update(updatedFields, { where: { Email: email } });

        if (updatedAgent[0] === 0) {
            return res.status(404).json({ message: `Agentul cu emailul ${email} nu a fost gasit` });
        }

        res.status(200).json({ message: 'Agentul a fost actualizat cu succes' });
    } catch (error) {
        console.error('Eroare la actualizarea agentului:', error);
        res.status(500).json({ message: 'Eroare la actualizarea agentului', error: error.message });
    }
};




// Delete agent
const deleteAgent = async (req, res) => {
    try {
        let email = req.params.email;
        const agent = await Agent.findOne({ where: { Email: email } });

        if (!agent) {
            return res.status(404).json({ message: `Agentul cu emailul ${email} nu a fost gasit` });
        }
        console.log('Agent gasit pentru actualizare:', agent.dataValues);
        await Agent.update(
            { isDeleted: true },
            { where: { Email: email } }
        );

        res.status(200).json({
            message: 'Agentul a fost marcat ca sters cu succes!',
            detalii: { ...agent.dataValues, isDeleted: true }
        });

    } catch (error) {
        console.error('Eroare la marcarea agentului ca sters: ', error);
        res.status(500).json({ message: 'Eroare la marcarea agentului ca sters', error: error.message });
    }
};

const getAgentInfo = async (req, res) => {
    try {
        const agenti = await db.agenti.findAll();
        const puncteDeTrecere = await db.puncteDeTrecere.findAll();
        const puncteDeDevamare = await db.puncteDeDevamare.findAll();

        const agentiCuPuncte = agenti.map(agent => {
            const punctTrecere = puncteDeTrecere.find(p => p.id_punct == agent.id_punct);
            const punctDevamare = puncteDeDevamare.find(p => p.id_devamare == agent.id_punct);

            return {
                Data_nasterii: agent.Data_nasterii,
                Email: agent.Email,
                Nume: agent.Nume,
                Prenume: agent.Prenume,
                Role: agent.Role,
                Telefon: agent.Telefon,
                id_punct: agent.id_punct,
                Locatie: punctTrecere
                    ? punctTrecere.Locatia_punct_de_trecere
                    : punctDevamare
                        ? punctDevamare.Locatia_punct_de_devamare
                        : null
            };
        });

        if (agentiCuPuncte.length === 0) {
            return res.status(404).json({ message: 'Nu sunt agenti disponibili.' });
        }

        res.status(200).json(agentiCuPuncte);
    } catch (error) {
        console.error('Eroare la obtinerea informatiilor despre agenti:', error);
        res.status(500).json({ message: 'Eroare la obtinerea informatiilor despre agenti', error: error.message });
    }
};


module.exports = {
    addAgent,
    getAllAgents,
    getAgent,
    updateAgent,
    deleteAgent,
    getAgentsByVama,
    getAgentsByDevamare,
    getAgentInfo
};
