module.exports = (sequelize, Sequelize) => {

    const Inventario_boletosAPI = sequelize.define("inventario_boletosAPI", {

        id_carrito: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_concierto_carrito: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "conciertosAPI",
                key: "id_concierto"
            },
        },

        nombre_boleto_carrito: {
            type: Sequelize.STRING,
            allowNull: false
        },

        seccion: {
            type: Sequelize.ENUM("VIP", "Premium", "Economy"),
            allowNull: false
        },

        precio : {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        },

        cantidad_tickets_comprada: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },
        {
            tableName: "inventario_boletosAPI"
        }
    );
    return Inventario_boletosAPI;
}