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

        ganancia_tarjeta: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        ganancia_efectivo: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        ganacia_total: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        cierre_caja: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        fecha_liquidacion: {
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