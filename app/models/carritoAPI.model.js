module.exports = (sequelize, Sequelize) => {

    const CarritoAPI = sequelize.define("carritoAPI", {

        id_carrito: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_inventario_carrito: {
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

        cantidad_tickets_comprados: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        total_carrito: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        }

    },
        {
            tableName: "carritoAPI"
        }
    );
    return CarritoAPI;
}