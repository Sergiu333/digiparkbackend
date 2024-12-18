module.exports = (sequelize, DataTypes) => {
    const puncteDeDevamare = sequelize.define('Puncte_de_devamare', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        Locatia_punct_de_devamare: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Adresa: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        id_agent: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_devamare: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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

    return puncteDeDevamare;
};
