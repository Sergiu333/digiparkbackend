const db = require('../models');
const bcrypt = require('bcrypt');
const Admin = db.admin;

// Add admin
const addAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ where: { Email: req.body.Email } });

        if (existingAdmin) {
            return res.status(409).json({ message: 'Email deja folosit de catre un Admin' });
        }
        // Get the information from the request body
        let info = {
            Nume: req.body.Nume,
            Prenume: req.body.Prenume,
            Email: req.body.Email,
            Telefon: req.body.Telefon,
            Data_nasterii: req.body.Data_nasterii,
            Parola:req.body.Parola
        };

        // Create the admin entry in the database
        const admin = await Admin.create(info);

        // Send the response
        res.status(200).send({
            id_admin: admin.id_admin,
            Nume: admin.Nume,
            Prenume: admin.Prenume,
            Telefon: admin.Telefon,
            Email: admin.Email,
            Data_nasterii: admin.Data_nasterii,
        });
        console.log(admin);
    } catch (error) {
        console.error('Eroare la adaugarea adminului:', error);
        res.status(500).json({ message: 'Eroare la adaugarea adminului', error: error.message });
    }
};

//authenticate as admin

const authenticateAdmin = async (req, res) => {
    const { email, Parola } = req.body;

    try {

        const admin = await Admin.findOne({ where: { Email: email } });

        if (!admin) {
            return res.status(401).json({ message: `Adminul cu emailul ${email} nu a fost gasit` });
        }


        const isPasswordValid = await bcrypt.compare(Parola, admin.Parola);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Parola incorecta' });
        }

        //   JWT

        res.status(200).json({ message: 'Autentificat cu succes in calitate de Admin!' });
    } catch (error) {
        console.error('Eroare la autentificarea adminului:', error);
        res.status(500).json({ message: 'Eroare la autentificarea adminului', error: error.message });
    }
};


// Get all admins
const getAllAdmins = async (req, res) => {
    try {

        let admins = await Admin.findAll({
            attributes: ['id_admin', 'Nume', 'Prenume', 'Email','Telefon', 'Data_nasterii', 'Role']
        });
        res.status(200).send(admins);
    } catch (error) {
        console.error('Error getting admins:', error);
        res.status(500).json({ message: 'Error getting admins', error: error.message });
    }
}

//get admin by email
const getAdmin = async (req, res) => {
    try {
        let email = req.params.Email;
        let admin = await Admin.findOne({
            where: {
                Email: email
            },
            attributes: ['id_admin', 'Nume', 'Prenume', 'Email', 'Telefon', 'Data_nasterii', 'Role']
        });
        if (admin == null) {
            return res.status(404).json({ message: 'Adminul cu acest email nu a fost gasit.' });
        }
        res.status(200).send(admin);
    } catch (error) {
        console.error('Eroare la gasirea adminului:  ', error);
        res.status(500).json({ message: 'Eroare la gasirea adminului:', error: error.message });
    }
};

//update admin


const updateAdmin = async (req, res) => {
    try {
        let email = req.params.Email;
        let updateData = req.body;


        if (updateData.Parola) {

            updateData.Parola = await bcrypt.hash(req.body.Parola, 10);
        }


        let admin = await Admin.update(updateData, {
            where: { Email: email }
        });

        if (admin[0] === 0) {
            return res.status(404).json({ message: `Admin cu emailul ${email} nu a fost gasit.` });
        }

        res.status(200).send({ message: 'Admin actualizat cu succes!' });
    } catch (error) {
        console.error('Eroare la actualizarea adminului: ', error);
        res.status(500).json({ message: 'Eroare la actualizarea adminului:', error: error.message });
    }
};

//delete admin

const deleteAdmin = async (req, res) => {
    try {
        let email = req.params.Email;
        let admin = await Admin.update(
            { isDeleted: true },
            {
                where: {
                    Email: email
                }
            }
        );

        if (admin[0] === 0) {
            return res.status(404).json({ message: `Adminul cu acest email ${email} nu a fost gasit.` });
        }

        res.status(200).send({ message: 'Admin marcat ca sters cu succes' });
    } catch (error) {
        console.error('Eroare la marcarea adminului ca sters: ', error);
        res.status(500).json({ message: 'Eroare la marcarea adminului ca sters:', error: error.message });
    }
};

module.exports = {
    addAdmin,
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    authenticateAdmin,
};
