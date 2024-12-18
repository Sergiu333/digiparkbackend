const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        id_admin: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Nume: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        Prenume: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        Parola: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Telefon: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        Data_nasterii: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Role:{
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Admin'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: false,
        freezeTableName: true,
        hooks: {
            beforeCreate: async (admin) => {
                const salt = await bcrypt.genSalt(10);
                admin.Parola = await bcrypt.hash(admin.Parola, salt);
            }
        }
    });

    return Admin;
}
