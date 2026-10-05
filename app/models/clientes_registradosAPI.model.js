module.exports = (sequelize, Sequelize) => {

    const Clientes_registradosAPI = sequelize.define("clientes_registradosAPI", {

        id_cliente: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_completo_cliente: {
            type: Sequelize.STRING(50),
            allowNull: false
        },

        nit_cliente: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        correo_cliente: {
            type: Sequelize.STRING(120),
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        telefono_cliente: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },
        {
            tableName: "clientes_registradosAPI"
        }
    );
    return Clientes_registradosAPI;
}