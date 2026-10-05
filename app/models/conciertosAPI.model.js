module.exports = (sequelize, Sequelize) => {

    const ConciertosAPI = sequelize.define("conciertosAPI", {

        id_concierto: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_artista_concierto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "artistasAPI",
                key: "id_artista"
            },
            onDelete: "CASCADE"
        },

        nombre_artista_concierto: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },

        nombre_concierto: {
            type: Sequelize.STRING(50),
            unique: true,
            allowNull: false
        },

        fecha_concierto: {
            type: Sequelize.DATE,
            allowNull: false,
        },

        horario: {
            type: Sequelize.STRING(15),
            allowNull: false
        },

        ubicacion: {
            type: Sequelize.STRING(120),
            allowNull: false
        },

        estado_concierto: {
            type: Sequelize.ENUM("Agendado","Activo","Finalizado","Cancelado"),
            allowNull: false,
            defaultValue: "Agendado"
        },

        capacidad_concierto: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },
        {
            tableName: "conciertosAPI"
        }
    );
    return ConciertosAPI;
}