module.exports = (sequelize, Sequelize) => {

    const EntradaAPI = sequelize.define("entradaAPI", {

        id_entrada: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_venta_entrada: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },

        token: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },

        estado: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "ACTIVA"
        }

    }, {
        timestamps: false
    });

    return EntradaAPI;
};