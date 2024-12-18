const jwt = require('jsonwebtoken');
const {camioane, agenti} = require("../models");
require('dotenv').config();

const authenticateToken = (req, res, next) => {

    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.sendStatus(403); // Forbidden if not admin
    }
};

const filterDeletedRecords = (model) => (req, res, next) => {
    const originalFindAll = model.findAll;

    model.findAll = async function(options) {
        options = options || {};

        options.where = {
            ...options.where,
            isDeleted: false
        };

        return await originalFindAll.call(this, options);
    };

    next();
};


module.exports = { authenticateToken, authorizeAdmin, filterDeletedRecords };