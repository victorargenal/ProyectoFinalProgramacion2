module.exports = (sequelize, Sequelize) => {

    const Inventario_boletosAPI = sequelize.define("inventario_boletosAPI", {

        id_inventario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_concierto_inventario: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "conciertosAPI",
                key: "id_concierto"
            },
            onDelete: "CASCADE" //elimiina automaticamente si se elimina concierto
        },

        nombre_boleto_inventario: {
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

        estado_ticket: {
            type: Sequelize.ENUM("Disponible", "Agotado"),
            allowNull: false,
            defaultValue: "Disponible"
        },

        cantidad_total: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        cantidad_tickets_disponible: {
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