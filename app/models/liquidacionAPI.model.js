module.exports = (sequelize, Sequelize) => {

    const LiquidacionAPI = sequelize.define("liquidacionAPI", {

        id_liquidacion: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_vendedor: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },

        gananciaTarjeta: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        gananciaEfectivo: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        ganaciaTotal: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        cierreCaja: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        fechaLiquidacion: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },

    },
        {
            tableName: "liquidacionAPI"
        }
    );
    return LiquidacionAPI;
}