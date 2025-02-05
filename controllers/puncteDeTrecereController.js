const db = require('../models');

const puncteDeTrecere = db.puncteDeTrecere;
const Agenti = db.agenti;

//create punct de trecere

const addPunctDeTrecere = async (req, res) => {
    try {
        let info = {
            Locatia_punct_de_trecere: req.body.Locatia_punct_de_trecere,
            Adresa: req.body.Adresa,
            Vama: req.body.Vama,

        }
        let punctDeTrecere = await puncteDeTrecere.create(info);
        res.status(201).json(punctDeTrecere);
    } catch (err) {
        console.error('Eroare la crearea punctului de trecere:', err);
        res.status(500).json({ message: 'Eroare la crearea punctului de trecere', error: err.message });
    }
}

//get all punct de trecere
const getAllPuncteDeTrecere = async (req, res) => {
    try {
        const puncte = await puncteDeTrecere.findAll({
            attributes: [
                'id_punct',
                'Adresa',
                'Vama',
                'Locatia_punct_de_trecere'
            ]
        });

        let formatedPuncte = puncte.map(punct => {
            let camion = punct.Camioane;
            if (camion) {
                return {
                    ...punct.dataValues,
                    Camioane: {
                        ...camion.dataValues,
                        Timp_intrare: new Date(camion.Timp_intrare).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }),
                        Timp_iesire: camion.Timp_iesire ? new Date(camion.Timp_iesire).toLocaleString('en-GB', { timeZone: 'Europe/Bucharest', hour12: false }) : null

                    },
                    Agenti: punct.Agenti
                };
            } else {
                return punct;
            }
        });
        if(formatedPuncte.lenght == 0){
            return res.status(404).json({ message: 'Nu sunt puncte de trecere in baza de date' });
        }
        res.status(200).json(formatedPuncte);

    } catch (error) {
        console.error('Error getting all puncte de trecere:', error);
        res.status(500).json({ message: 'Eroare la afisarea punctulelor de trecere', error: error.message });
    }
}

//get punct de trecere by adress

const getPunctDeTrecereByAdress = async (req, res) => {
    try {
        let adresa = req.params.adresa;
        let puncte = await puncteDeTrecere.findOne({
            where: {
                Locatia_punct_de_trecere: adresa
            },
            attributes: [
                'Adresa',
                'Vama',
                'Locatia_punct_de_trecere'
            ]
        });
        if(puncte == null){
            return res.status(404).json({ message: 'Nu exista un punct de trecere la aceasta adresa' });
        }

        res.status(200).json(puncte);

    } catch (error) {
        console.error('Error getting punct de trecere by adress:', error);
        res.status(500).json({ message: 'Error getting punct de trecere by adress', error: error.message });
    }

}
const getAgentsByPunctDeTrecere = async (req, res) => {
    try {
        const adresa = req.params.adresa;

        // Find the punct de trecere based on the provided address
        const puncte = await puncteDeTrecere.findOne({
            where: {
                Locatia_punct_de_trecere: adresa
            },
            attributes: ['Adresa', 'Vama', 'Locatia_punct_de_trecere'],
            include: [
                {
                    model: Agenti,
                    required: false,
                    attributes: ['id_agent', 'Nume', 'Prenume', 'Email']
                }
            ]
        });

        // Check if the puncte exists
        if (!puncte) {
            return res.status(404).json({ message: 'Punct de trecere cu aceasta adresa nu a fost gasit' });
        }

        res.status(200).json(puncte);

    } catch (error) {
        console.error('Error getting agents by punct de trecere:', error);
        res.status(500).json({ message: 'Error getting agents by punct de trecere', error: error.message });
    }
};


//update punct de trecere
const updatePunctDeTrecere = async (req, res) => {
    try {
        const adresa = req.params.adresa;

        // Verificăm dacă punctul de trecere există
        const punctDeTrecere = await puncteDeTrecere.findOne({
            where: { Adresa: adresa }
        });

        if (!punctDeTrecere) {
            return res.status(404).json({ message: `Punct de trecere cu adresa '${adresa}' nu a fost găsit` });
        }

        // Verificăm ce date vin în req.body
        console.log('Datele pentru actualizare:', req.body);

        const [numUpdatedRows] = await puncteDeTrecere.update(req.body, {
            where: {
                Adresa: adresa
            }
        });

        if (numUpdatedRows === 0) {
            return res.status(400).json({ message: `Punct de trecere cu adresa '${adresa}' nu a fost actualizat, datele sunt identice` });
        }

        res.status(200).send({ message: `Punct de trecere cu adresa '${adresa}' a fost actualizat cu succes` });

    } catch (error) {
        console.error('Error updating punct de trecere:', error);
        res.status(500).json({ message: 'Error updating punct de trecere', error: error.message });
    }
};


//delete punct de trecere

const deletePunctDeTrecere = async (req, res) => {
    try {
        let adresa = req.params.adresa;

        const punctDeTrecere = await puncteDeTrecere.findOne({
            where: { Adresa: adresa }
        });

        if (!punctDeTrecere) {
            return res.status(404).json({ message: `Punctul de trecere cu adresa '${adresa}' nu exista` });
        }

        console.log('Punct de trecere gasit pentru actualizare:', punctDeTrecere.dataValues);

        await puncteDeTrecere.update(
            { isDeleted: true },
            { where: { Adresa: adresa } }
        );

        res.status(200).json({
            message: `Punct de trecere cu adresa '${adresa}' a fost marcat ca sters!`,
            detalii: { ...punctDeTrecere.dataValues, isDeleted: true }
        });

    } catch (error) {
        console.error('Error deleting punct de trecere:', error);
        res.status(500).json({ message: 'Error deleting punct de trecere', error: error.message });
    }
};



const getTimpMediuPuncteTrecere = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.Adresa, 
                p.Locatia_punct_de_trecere, 
                p.Vama, 
                (SELECT TIMESTAMPDIFF(MINUTE, c2.Timp_intrare, c2.Timp_iesire)
                 FROM Camioane c2
                 WHERE c2.id_punct_de_trecere = p.id 
                       AND c2.isDeleted = false
                       AND TIMESTAMPDIFF(HOUR, c2.Timp_intrare, c2.Timp_iesire) <= 24 
                 ORDER BY c2.Timp_iesire DESC
                 LIMIT 1) AS timp_stat_ultima_masina_minute,
                AVG(TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)) AS timp_mediu_minute,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 30 MINUTE THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_30_minute,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 1 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultima_ora,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 3 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_3_ore,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 6 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_6_ore,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 12 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_12_ore,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 1 DAY THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_24_ore,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 1 WEEK THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultima_saptamana,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 1 MONTH THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultima_luna,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 48 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_48_ore,
                AVG(CASE 
                    WHEN c.Timp_iesire >= NOW() - INTERVAL 72 HOUR THEN TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)
                END) AS media_ultimele_72_ore,
                (SELECT AVG(TIMESTAMPDIFF(MINUTE, c3.Timp_intrare, c3.Timp_iesire))
                 FROM Camioane c3
                 WHERE c3.id_punct_de_trecere = p.id 
                       AND c3.isDeleted = false
                       AND TIMESTAMPDIFF(HOUR, c3.Timp_intrare, c3.Timp_iesire) <= 24  
                 ORDER BY c3.Timp_iesire DESC
                 LIMIT 10) AS media_timp_stat_ultimele_10_masini
            FROM Puncte_de_trecere p
            LEFT JOIN Camioane c 
                ON p.id = c.id_punct_de_trecere
           WHERE 
                 p.isDeleted = false
            AND TIMESTAMPDIFF(HOUR, c.Timp_intrare, c.Timp_iesire) <= 24 
            GROUP BY 
            p.id
        `;

        const results = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const calculateWeightedTime = (item) => {
            const weights = {
                media_ultimele_30_minute: 0.4,
                media_ultima_ora: 0.3,
                media_ultimele_3_ore: 0.15,
                media_ultimele_6_ore: 0.1,
                media_ultimele_12_ore: 0.05,
                media_ultimele_24_ore: 0.05,
            };

            let weightedTime = 0;
            weightedTime += (item.media_ultimele_30_minute || 0) * weights.media_ultimele_30_minute;
            weightedTime += (item.media_ultima_ora || 0) * weights.media_ultima_ora;
            weightedTime += (item.media_ultimele_3_ore || 0) * weights.media_ultimele_3_ore;
            weightedTime += (item.media_ultimele_6_ore || 0) * weights.media_ultimele_6_ore;
            weightedTime += (item.media_ultimele_12_ore || 0) * weights.media_ultimele_12_ore;
            weightedTime += (item.media_ultimele_24_ore || 0) * weights.media_ultimele_24_ore;

            return Math.round(weightedTime);
        };

        const formattedResults = results.map(result => ({
            Adresa: result.Adresa,
            Locatia_punct_de_trecere: result.Locatia_punct_de_trecere,
            Vama: result.Vama,
            Timp_mediu_minute: result.timp_mediu_minute ? Math.round(result.timp_mediu_minute) : null,
            Timp_stat_ultima_masina_minute: result.timp_stat_ultima_masina_minute ? Math.round(result.timp_stat_ultima_masina_minute) : null,
            Media_ultimele_30_minute: result.media_ultimele_30_minute ? Math.round(result.media_ultimele_30_minute) : null,
            Media_ultima_ora: result.media_ultima_ora ? Math.round(result.media_ultima_ora) : null,
            Media_ultimele_3_ore: result.media_ultimele_3_ore ? Math.round(result.media_ultimele_3_ore) : null,
            Media_ultimele_6_ore: result.media_ultimele_6_ore ? Math.round(result.media_ultimele_6_ore) : null,
            Media_ultimele_12_ore: result.media_ultimele_12_ore ? Math.round(result.media_ultimele_12_ore) : null,
            Media_ultimele_24_ore: result.media_ultimele_24_ore ? Math.round(result.media_ultimele_24_ore) : null,
            Media_ultima_saptamana: result.media_ultima_saptamana ? Math.round(result.media_ultima_saptamana) : null,
            Media_ultima_luna: result.media_ultima_luna ? Math.round(result.media_ultima_luna) : null,
            Media_ultimele_48_ore: result.media_ultimele_48_ore ? Math.round(result.media_ultimele_48_ore) : null,
            Media_ultimele_72_ore: result.media_ultimele_72_ore ? Math.round(result.media_ultimele_72_ore) : null,
            Media_timp_stat_ultimele_10_masini: result.media_timp_stat_ultimele_10_masini ? Math.round(result.media_timp_stat_ultimele_10_masini) : null,
            Timp_ponderat: calculateWeightedTime(result)
        }));

        return res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Error fetching average time:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    addPunctDeTrecere,
    getAllPuncteDeTrecere,
    getPunctDeTrecereByAdress,
    updatePunctDeTrecere,
    deletePunctDeTrecere,
    getAgentsByPunctDeTrecere,
    getTimpMediuPuncteTrecere
}
