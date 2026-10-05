module.exports = (sequelize, Sequelize) => {

    const ArtistasAPI = sequelize.define("artistasAPI", {

        id_artista: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_artista: {
            type: Sequelize.STRING(120),
            unique: true,
            allowNull: false
        },

        pais_origen: {
            type: Sequelize.STRING(50),
            allowNull: false
        },

        cancion_famosa: {
            type: Sequelize.STRING(50),
            allowNull: false
        },

        album_famoso: {
            type: Sequelize.STRING(50),
            allowNull: false
        },

        oyentes_totales: {
            type: Sequelize.INTEGER,
            allowNull: false
        }

    },
        {
            tableName: "artistasAPI"
        }
    );
    return ArtistasAPI;
}