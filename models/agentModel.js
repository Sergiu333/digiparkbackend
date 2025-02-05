module.exports = (sequelize, DataTypes) => {
    const Agent = sequelize.define('Agenti', {
        id_agent: {
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
        },
        Telefon: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        Data_nasterii: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        Parola: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        Role:{
            type: DataTypes.STRING(10),
            defaultValue: 'Agent',
            allowNull: false,

        },
        id_punct: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        id_devamare: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Agent;
};
