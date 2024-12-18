const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

const login = async (req, res) => {
    const { email, parola } = req.body;
    try {
        const admin = await db.admin.findOne({ where: { Email: email } });
        if (admin) {
            const isPasswordValid = await bcrypt.compare(parola, admin.Parola);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email sau parola incorecte.' });
            }

            const accessToken = jwt.sign(
                { id: admin.id_admin, isAdmin: true, email: admin.Email, firstname: admin.Nume, lastname: admin.Prenume },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                access_token: accessToken,
                user: {
                    isAdmin: true,
                    email: admin.Email,
                    firstname: admin.Nume,
                    lastname: admin.Prenume
                }
            });
        }

        const agent = await db.agenti.findOne({ where: { Email: email } });
        if (agent) {
            const isPasswordValid = await bcrypt.compare(parola, agent.Parola);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email sau parola incorecte.' });
            }

            const accessToken = jwt.sign(
                { id: agent.id_agent, isAdmin: false, email: agent.Email, firstname: agent.Nume, lastname: agent.Prenume },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                access_token: accessToken,
                user: {
                    isAdmin: false,
                    email: agent.Email,
                    firstname: agent.Nume,
                    lastname: agent.Prenume
                }
            });
        }

        const user = await db.user.findOne({ where: { email } });
        if (user) {
            const isPasswordValid = await bcrypt.compare(parola, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email sau parola incorecte.' });
            }

            const accessToken = jwt.sign(
                { id: user.id_user, isAdmin: false, email: user.email, firstname: user.name, lastname: user.last_name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                access_token: accessToken,
                user: {
                    isAdmin: false,
                    email: user.email,
                    firstname: user.name,
                    lastname: user.last_name
                }
            });
        }

        return res.status(401).json({ message: 'Email sau parola incorecte.' });
    } catch (error) {
        console.error('Eroare la autentificare:', error);
        res.status(500).json({ message: 'Eroare la autentificare.' });
    }
};

module.exports = {
    login,
};
