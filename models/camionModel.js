module.exports = (sequelize, DataTypes) => {
    const Camion = sequelize.define('Camioane', {
        id_camion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        Numar_inmatriculare: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        Timp_intrare: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Timp_iesire: {
            type: DataTypes.DATE,
            allowNull: true
        },
        Succes: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        id_agent: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Agenti',
                key: 'id_agent'
            }
        },
        id_punct_de_trecere: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Puncte_de_trecere',
                key: 'id'
            }
        },
        id_punct_de_devamare: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Puncte_de_devamare',
                key: 'id'
            }
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });

    Camion.associate = (models) => {
        Camion.belongsTo(models.Agenti, {
            foreignKey: 'id_agent',
            as: 'agent'
        });
        Camion.belongsTo(models.Puncte_de_trecere, {
            foreignKey: 'id_punct_de_trecere',
            as: 'punctDeTrecere'
        });
    };

    return Camion;
};
