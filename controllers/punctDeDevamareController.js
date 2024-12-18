const db = require('../models');

const puncteDeDevamare = db.puncteDeDevamare;
const Agenti = db.agenti;
//create punct de devamare

const addPunctDeDevamare = async (req, res) => {
    try {
        let info = {
            Locatia_punct_de_devamare: req.body.Locatia_punct_de_devamare,
            Adresa: req.body.Adresa,
        }
        let punctDeDevamare = await puncteDeDevamare.create(info);
        res.status(201).json(punctDeDevamare);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

//get all puncte de devamare
const getAllPuncteDevamare = async (req, res) => {
    try {
        const puncte = await puncteDeDevamare.findAll({
            attributes: [
                'Locatia_punct_de_devamare',
                'Adresa',
                'id_devamare'
            ]
        });

        if (puncte.lenght == 0) {
            return res.status(200).json({ message: 'Nu sunt puncte de devamare in baza de date.' });
        }

        res.status(200).json(puncte);
    } catch (error) {
        console.error('Error fetching puncte de devamare:', error);
        res.status(500).json({ message: 'Eroare la afisarea punctelor de devamare', error: error.message });
    }


}

//get punct de devamare by adress
const getPunctDeDevamareByAdress = async (req, res) => {
    try {
        let locatia = req.params.locatia;
        let puncte = await puncteDeDevamare.findOne({
            where: {
                Locatia_punct_de_devamare: locatia
            },
            attributes: [
                'Locatia_punct_de_devamare',
                'Adresa'
            ]
        });

        if (locatia == null) {
            return res.status(404).json({ message: `Punctul de devamare cu locatia ${locatia} nu a fost gasit.` });
        }
        res.status(200).json(puncte);

    } catch (error) {
        console.error('Error getting punct de devamare by address:', error);
        res.status(500).json({ message: 'Eroare la afisarea punctului de devamare dupa adresa', error: error.message });
    }

}

//update punct de devamare
const updatePunctDeDevamare = async (req, res) => {
    try {
        let locatia = req.params.locatia;
        const punctDeDevamare = await puncteDeDevamare.update(req.body, {
            where: {
                Locatia_punct_de_devamare: locatia
            }
        });

        if (locatia == null) {
            return res.status(404).json({ message: `Punctul de devamare cu locatia ${locatia} nu a fost gasit.` });
        }
        res.status(200).send(punctDeDevamare);

    } catch (error) {
        console.error('Eroare la actualizarea punctului de devamare:', error);
        res.status(500).json({ message: 'Eroare la actualizarea punctului de devamare', error: error.message });
    }
}

const getAgentsByPunctDeDevamare = async (req, res) => {
    try {
        const adresa = req.params.adresa;

        // Find the punct de trecere based on the provided address
        const puncte = await puncteDeDevamare.findOne({
            where: {
                Locatia_punct_de_devamare: adresa
            },
            attributes: ['Adresa', 'Locatia_punct_de_devamare'],
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
            return res.status(404).json({ message: `Punctul de devamare cu adresa ${adresa} nu a fost gasit` });
        }

        res.status(200).json(puncte);

    } catch (error) {
        console.error('Eroare la afisarea agentilor dupa punct de devamare:', error);
        res.status(500).json({ message: 'Eroare la afisarea agentilor dupa punct de devamare', error: error.message });
    }
};

//delete camion

const deletePunctDeDevamare = async (req, res) => {
    try {
        let locatia = req.params.locatia;

        let punctdedevamare = await puncteDeDevamare.update(
            { isDeleted: true },
            { where: { Locatia_punct_de_devamare: locatia } }
        );

        if (punctdedevamare[0] === 0) {
            return res.status(404).send({ message: `Punctul de devamare ${locatia} nu exista ` });
        }

        res.status(200).send({ message: 'Punct de devamare marcat ca sters cu succes!' });

    } catch (error) {
        console.error('Error deleting punct de devamare:', error);
        res.status(500).json({ message: 'Eroare la marcare punctului de devamare ca sters', error: error.message });
    }
}

const getTimpMediuPuncteDevamare = async (req, res) => {
    try {
        const query = `
            SELECT p.Adresa, p.Locatia_punct_de_devamare, 
                   AVG(TIMESTAMPDIFF(MINUTE, c.Timp_intrare, c.Timp_iesire)) AS timp_mediu_minute
            FROM Puncte_de_devamare p
            LEFT JOIN Camioane c ON p.id = c.id_punct_de_devamare
            WHERE p.isDeleted = false 
            GROUP BY p.id
        `;

        const results = await db.sequelize.query(query, {
            type: db.Sequelize.QueryTypes.SELECT
        });

        const formattedResults = results.map(result => ({
            Adresa: result.Adresa,
            Locatia_punct_de_devamare: result.Locatia_punct_de_devamare,
            Timp_mediu_minute: result.timp_mediu_minute ? Math.round(result.timp_mediu_minute) : null
        }));

        return res.status(200).json(formattedResults);
    } catch (error) {
        console.error('Error fetching average time:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};





module.exports = {
    addPunctDeDevamare,
    getAllPuncteDevamare,
    getPunctDeDevamareByAdress,
    updatePunctDeDevamare,
    deletePunctDeDevamare,
    getAgentsByPunctDeDevamare,
    getTimpMediuPuncteDevamare
}
