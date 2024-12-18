const db = require('../models');

const Agent = db.agenti;
const Camion = db.camioane;
const PunctDeTrecere = db.puncteDeTrecere;
const PunctDeDevamare = db.puncteDeDevamare;

//main work

//create camion

const addCamion = async (req, res) => {
    try {
        const { Numar_inmatriculare, Succes, email } = req.body;

        if (!Numar_inmatriculare || !Succes || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const agent = await Agent.findOne({
            where: { Email: email }
        });

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        const id_punct = agent.id_punct;

        const punctDeTrecere = await PunctDeTrecere.findOne({
            where: { id_punct: id_punct, isDeleted: false }
        });

        let punctDeDevamare = null;

        if (!punctDeTrecere) {
            punctDeDevamare = await PunctDeDevamare.findOne({
                where: { id_devamare: id_punct, isDeleted: false }
            });

            if (!punctDeDevamare) {
                return res.status(404).json({ message: 'Punct de trecere or devamare not found for the agent' });
            }
        }

        let info = {
            Numar_inmatriculare,
            Timp_intrare: new Date(),
            Timp_iesire: null,
            Succes,
            id_agent: agent.id_agent,
            id_punct_de_trecere: punctDeTrecere ? punctDeTrecere.id : null,
            id_punct_de_devamare: punctDeTrecere ? null : punctDeDevamare.id
        };

        const camion = await Camion.create(info);

        let formattedCamion = {
            ...camion.dataValues,
            Timp_intrare: camion.Timp_intrare.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }),
            Timp_iesire: camion.Timp_iesire ? camion.Timp_iesire.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null
        };

        res.status(200).send(formattedCamion);

    } catch (error) {
        console.error('Error adding camion:', error);
        res.status(500).json({ message: 'Error adding camion', error: error.message });
    }
};




// Get all Camions with formatted timestamps
const getAllCamion = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await Camion.findAndCountAll({
            attributes: [
                'Numar_inmatriculare',
                'Timp_intrare',
                'Timp_iesire',
                'Succes'
            ],
            limit: limit,
            offset: offset
        });


        let formattedCamioane = rows.map(camion => {
            return {
                ...camion.dataValues,
                Timp_intrare: camion.Timp_intrare.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }),
                Timp_iesire: camion.Timp_iesire ? camion.Timp_iesire.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null
            };
        });

        const totalPages = Math.ceil(count / limit);

        if(formattedCamioane.lenght == 0){
            return res.status(404).json({ message: 'Nu sunt camioane un baza de date.' });
        }
        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            totalRecords: count,
            records: formattedCamioane
        });
    } catch (error) {
        console.error('Eroare la afisarea camioanelor:', error);
        res.status(500).json({ message: 'Eroare la afisarea camioanelor', error: error.message });
    }
};



//get camion by numar de inmatriculare

const getCamion = async (req, res) => {
    try {


        let id = req.params.id;
        let camion = await Camion.findOne({
            where: {
                Numar_inmatriculare: id
            },
            attributes: [
                'Numar_inmatriculare',
                'Timp_intrare',
                'Timp_iesire',
                'Succes'
            ]
        });

        // Formatting the response for Timp_intrare and Timp_iesire
        let formattedCamion = {
            ...camion.dataValues,
            Timp_intrare: camion.Timp_intrare.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }),
            Timp_iesire: camion.Timp_iesire ? camion.Timp_iesire.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null
        };

        if(camion == null){
            return res.status(404).json({ message: `Camionul cu id-ul ${id} nu a fost gasit.` });  //camionul nu a fost gasit in baza de date.
        }

        res.status(200).send(formattedCamion);
    } catch (error) {
        console.error('Eroare la afisarea camionului : ', error);
        res.status(500).json({ message: 'Eroare la afisarea camionului', error: error.message });
    }
}


//update camion

const updateCamion = async (req, res) => {
    try {


        let id = req.params.id;

        const camion = await Camion.update(req.body, { where: { Numar_inmatriculare: id } });

        if(camion == null){
            return res.status(404).json({ message: `Camionul cu id-ul ${id} nu a fost gasit.` });  //camionul nu a fost gasit in baza de date.
        }
        res.status(200).send(camion);
    } catch (error) {
        console.error('Eroare la actualizarea camionului: ', error);
        res.status(500).json({ message: 'Eroare la actualizarea camionului', error: error.message });
    }
}

//delete camion

const deleteCamion = async (req, res) => {
    try {
        let id = req.params.id;

        let camion = await Camion.update(
            { isDeleted: true },
            { where: { Numar_inmatriculare: id } }
        );

        if (camion[0] === 0) {
            return res.status(404).json({ message: `Camionul cu id-ul ${id} nu a fost gasit.` });
        }

        res.status(200).send({ message: 'Camionul a fost marcat ca sters cu succes' });

    } catch (error) {
        console.error('Eroare la marcarea camionului ca sters: ', error);
        res.status(500).json({ message: 'Eroare la marcarea camionului ca sters', error: error.message });
    }
};


//success camions

const getSuccessCamions = async (req, res) => {
    try {

        const camioane = await Camion.findAll({ where: { Succes: true } });

        if(camion == null){
            return res.status(404).json({ message: 'Nu sunt camioane cu trecute cu succes.' });
        }
        res.status(200).send(camioane);
    } catch (error) {
        console.error('Eroare la afisarea camionului : ', error);
        res.status(500).json({ message: 'Eroare la afisarea camionului', error: error.message });
    }
}



const getCamioaneByAgentEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const agent = await Agent.findOne({
            where: { Email: email }
        });

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found.' });
        }

        const camioane = await Camion.findAll({
            where: { id_agent: agent.id_agent },
            attributes: ['Numar_inmatriculare', 'Timp_intrare', 'Timp_iesire', 'Succes']
        });

        const punctDeTrecere = await PunctDeTrecere.findOne({
            where: { id_punct: agent.id_punct },
            attributes: ['Locatia_punct_de_trecere', 'Adresa', 'Vama']
        });

        const punctDeDevamare = await PunctDeDevamare.findOne({
            where: { id_devamare: agent.id_punct },
            attributes: ['Locatia_punct_de_devamare', 'Adresa']
        });

        if (!camioane || camioane.length === 0) {
            return res.status(404).json({ message: 'No camioane found for this agent.' });
        }

        const formattedCamioane = camioane.map(camion => {
            return {
                Numar_inmatriculare: camion.Numar_inmatriculare,
                Timp_intrare: camion.Timp_intrare ? camion.Timp_intrare : null,
                Timp_iesire: camion.Timp_iesire ? camion.Timp_iesire : null,
                Succes: camion.Succes,
                Locatia_punct_de_trecere: punctDeTrecere ? punctDeTrecere.Locatia_punct_de_trecere : null,
                Locatia_punct_de_devamare: punctDeDevamare ? punctDeDevamare.Locatia_punct_de_devamare : null,
                Adresa: punctDeTrecere ? punctDeTrecere.Adresa : null,
                Vama: punctDeTrecere ? punctDeTrecere.Vama : null
            };
        });

        res.status(200).json(formattedCamioane);
    } catch (error) {
        console.error('Error getting camioane by agent email:', error);
        res.status(500).json({ message: 'Error getting camioane', error: error.message });
    }
};


const getCamioaneByVama = async (req, res) => {
    try {
        const { vama, userEmail } = req.params;

        console.log(`utilizator logat: ${userEmail}`);
        console.log(`vama: ${vama}`);

        const agenti = await Agent.findAll();
        const camioane = await Camion.findAll();
        const puncteDeTrecere = await PunctDeTrecere.findAll();

        const agentiDinVama = agenti
            .filter(agent => {
                const punct = puncteDeTrecere.find(p => p.id_punct === agent.id_punct);
                return punct && punct.Vama === vama;
            })
            .map(agent => agent.id_agent);

        const camioaneInVama = camioane
            .filter(camion => {
                // console.log(camion.id_agent, userEmail, 'test');
                const isPending = camion.Succes === 'pending' && camion.id_agent === agenti.find(a => a.Email === userEmail).id_agent;
                return agentiDinVama.includes(camion.id_agent) &&
                    camion.Succes !== 'false' &&
                    camion.Succes !== '' &&
                    !isPending;
            });

        if (camioaneInVama.length === 0) {
            return res.status(404).json({ message: 'No camioane found for this vama.' });
        }

        const formattedCamioane = camioaneInVama.map(camion => {
            return {
                Numar_inmatriculare: camion.Numar_inmatriculare,
                Timp_intrare: camion.Timp_intrare ? camion.Timp_intrare.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null,
                Timp_iesire: camion.Timp_iesire ? camion.Timp_iesire.toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null,
                Succes: camion.Succes
            };
        });

        res.status(200).json(formattedCamioane);
    } catch (error) {
        console.error('Error getting camioane by vama:', error);
        res.status(500).json({ message: 'Error getting camioane', error: error.message });
    }
};



const getCamioaneByAdresaTrecere = async (req, res) => {
    const adresa = req.params.adresa;
    console.log('Caut camioane pentru adresa:', adresa);

    try {
        const camioane = await db.camioane.findAll({
            include: [{
                model: db.puncteDeTrecere,
                as: 'punctDeTrecere',
                where: { Adresa: adresa }
            }]
        });

        if (!camioane.length) {
            return res.status(404).json({ message: 'Nu s-au găsit camioane pentru adresa specificată.' });
        }

        return res.status(200).json(camioane);
    } catch (error) {
        console.error('Error fetching camioane:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getCamioaneByAdresaDevamare = async (req, res) => {
    const adresa = req.params.adresa;
    console.log('Caut camioane pentru adresa de devamare:', adresa);

    try {
        const camioane = await db.camioane.findAll({
            include: [{
                model: db.puncteDeDevamare,
                where: { Adresa: adresa },
                as: 'punctDeDevamare'
            }]
        });

        if (!camioane.length) {
            return res.status(404).json({ message: 'Nu s-au găsit camioane pentru adresa specificată.' });
        }

        return res.status(200).json(camioane);
    } catch (error) {
        console.error('Error fetching camioane:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getCamioaneByVamaExcludeAdresa = async (req, res) => {
    const { vama, excludeAdresa } = req.params;
    console.log(`Caut camioane pentru vama: ${vama}, excluzand email-ul: ${excludeAdresa}`);

    try {
        const camioane = await db.camioane.findAll({
            include: [
                {
                    model: db.puncteDeTrecere,
                    as: 'punctDeTrecere',
                    where: {
                        Vama: vama
                    }
                },
                {
                    model: db.agenti,
                    as: 'agent',
                    where: {
                        Email: { [db.Sequelize.Op.ne]: excludeAdresa }
                    }
                }
            ],
            where: { isDeleted: false }
        });

        if (!camioane.length) {
            return res.status(404).json({ message: 'Nu s-au gasit camioane pentru vama specificata.' });
        }

        return res.status(200).json(camioane);
    } catch (error) {
        console.error('Eroare la preluarea camioanelor:', error);
        return res.status(500).json({ message: 'Eroare internă de server' });
    }
};


module.exports = {
    addCamion,
    getAllCamion,
    getCamion,
    updateCamion,
    deleteCamion,
    getSuccessCamions,
    getCamioaneByAgentEmail,
    getCamioaneByVama,
    getCamioaneByAdresaTrecere,
    getCamioaneByAdresaDevamare,
    getCamioaneByVamaExcludeAdresa
}
