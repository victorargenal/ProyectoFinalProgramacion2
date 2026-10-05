module.exports = (sequelize, Sequelize) => {

    const Detalle_ventasAPI = sequelize.define("detalle_ventasAPI", {

        id_detalle: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_ventasReporte_detalle: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "ventas_reporteAPI",
                key: "id_venta"
            }
        },

        id_inventario_detalle: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "inventario_boletosAPI",
                key: "id_inventario"
            },
            onDelete: "CASCADE"
        },

        cantidad_tickets_comprados: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        subtotal: {
            type: Sequelize.DECIMAL(10,2),
            allowNull:false
        },

        fecha_emision: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        
        //variable flotante para el ciclo for dentro del create detalleVentas, para que sepa cuantas veces hacer el update de cada ticket
        items_comprados: { 
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },
        {
            tableName: "detalle_ventasAPI"
        }
    );
    return Detalle_ventasAPI;
}