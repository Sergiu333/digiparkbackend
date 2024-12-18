const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Pentru autentificare prin token
const User = db.user; // Modelul User

const registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(400).json({ message: 'Email deja folosit' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            email: req.body.email,
            name: req.body.name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Utilizator înregistrat cu succes',
            user: {
                id_user: user.id_user,
                email: user.email,
                name: user.name,
                last_name: user.last_name,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Eroare la înregistrare:', error);
        res.status(500).json({ message: 'Eroare la înregistrare', error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Utilizatorul nu există' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Parola este greșită' });
        }

        const token = jwt.sign(
            { id_user: user.id_user, email: user.email },
            process.env.JWT_SECRET || 'secret_key', // Schimbă cheia secretă în production
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Autentificare reușită',
            token,
            user: {
                id_user: user.id_user,
                email: user.email,
                name: user.name,
                last_name: user.last_name,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Eroare la logare:', error);
        res.status(500).json({ message: 'Eroare la logare', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { isDeleted: false },
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Eroare la obținerea utilizatorilor:', error);
        res.status(500).json({ message: 'Eroare la obținerea utilizatorilor', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getAllUsers
};
