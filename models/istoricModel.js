
module.exports = (sequelize, DataTypes) => {
    const istoric = sequelize.define('Istoric', {
        id_istoric: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_camion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            referecences: {
                model: 'Camioane',
                key: 'id_camion'
            }
        },
        id_punct_de_devamare: {
            type: DataTypes.INTEGER,
            allowNull: true,
            referecences: {
                model: 'Puncte_de_devamare',
                key: 'id_punct_de_devamare'
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
    return istoric;
}