module.exports = (sequelize, Sequelize) => {

    const UsuariosAPI = sequelize.define("usuariosAPI", {

        id_usuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_usuario: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: Sequelize.STRING(255),
            allowNull: false
        },

        nombre_completo: {
            type: Sequelize.STRING(100),
            allowNull: false
        },

        rol: {
            type: Sequelize.ENUM("Administrador", "Vendedor"),
            allowNull: false
        },

        estado_usuario: {
            type: Sequelize.ENUM("Activo", "Inactivo"),
            allowNull: false,
            defaultValue: "Activo"
        },

        fecha_creacion: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        }

    },
        {
            tableName: "usuariosAPI"
        }
    );
    return UsuariosAPI;
}