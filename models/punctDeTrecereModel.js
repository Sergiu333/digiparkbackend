module.exports = (sequelize, DataTypes) => {
    const punctDeTrecere = sequelize.define('Puncte_de_trecere', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        Adresa: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_agent: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Agenti',
                key: 'id_agent'
            }
        },
        id_punct: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        Vama: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        Locatia_punct_de_trecere: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    punctDeTrecere.associate = (models) => {
        punctDeTrecere.hasMany(models.camioane, {
            foreignKey: 'id_punct_de_trecere',
            as: 'Camioane'
        });
    };

    return punctDeTrecere;
};
