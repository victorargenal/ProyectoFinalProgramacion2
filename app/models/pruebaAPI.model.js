module.exports = (sequelize, Sequelize) => {

    const PruebaAPI = sequelize.define("pruebaAPI", {

        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        apellido: {
            type: Sequelize.STRING,
            allowNull: false
        },
        edad: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    });
    return PruebaAPI;
}