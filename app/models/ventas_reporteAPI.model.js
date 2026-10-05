module.exports = (sequelize, Sequelize) =>{

    const Ventas_reporteAPI= sequelize.define("ventas_reporteAPI", {

        id_venta: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_usuario_ventas: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "usuariosAPI",
                key: "id_usuario"
            },
        },

        nombre_usuario_ventas:{
            type: Sequelize.STRING,
            allowNull: false
        },

        fecha_venta: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },

        total_venta: {
            type: Sequelize.DECIMAL(10,2),
            allowNull: false
        }

    },
        {
            tableName: "ventas_reporteAPI"
        }
    );
    return Ventas_reporteAPI;
}