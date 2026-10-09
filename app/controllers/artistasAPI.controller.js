const db = require("../models");
const axios = require("axios");
const ArtistasAPI = db.artistasAPI;
const Op= db.Sequelize.Op;
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

exports.crearArtista = async (req, res) => {
    if (!req.body.nombre_artista || !req.body.pais_origen) {
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    try {
        const nombre_artista_recibido = req.body.nombre_artista;

        const Canciones = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
                params: {
                    method: "artist.getTopTracks",
                    artist: nombre_artista_recibido,
                    api_key: LASTFM_API_KEY,
                    format: "json",
                    limit: 1,
                    autocorrect: 1
                }
            }
        );

        const Albumes = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
                params: {
                    method: "artist.getTopAlbums",
                    artist: nombre_artista_recibido,
                    api_key: LASTFM_API_KEY,
                    format: "json",
                    limit: 1,
                    autocorrect: 1
                }
            }
        );

        const Artista = await axios.get(
            "https://ws.audioscrobbler.com/2.0/",
            {
                params: {
                    method: "artist.getInfo",
                    artist: nombre_artista_recibido,
                    api_key: LASTFM_API_KEY,
                    format: "json",
                    autocorrect: 1
                }
            }
        );

        const cancion_famosa =
            Canciones.data.toptracks.track[0].name;

        const album_famoso =
            Albumes.data.topalbums.album[0].name;

        const oyentes =
            Number(Artista.data.artist.stats.listeners);

        const artistasAPI = {
            nombre_artista: nombre_artista_recibido,
            pais_origen: req.body.pais_origen,
            cancion_famosa: cancion_famosa,
            album_famoso: album_famoso,
            oyentes_totales: oyentes
        };

        await ArtistasAPI.create(artistasAPI);
        res.send({
            message: "Artista creado correctamente"
        });
    }catch(err) {
        res.status(500).send({
            message:"Error al crear Artista, nombre de artista duplicado" 
        });
    }
};

exports.queryArtistas = (req, res) => {
    ArtistasAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los artistas"
            });
        });
};

exports.buscarNombre = (req, res) => {
    const nombre_artista_recibido = req.params.nombre_artista;
    const condition= {
        nombre_artista: {
            [Op.iLike]: `%${nombre_artista_recibido}%`
        }
    }

    ArtistasAPI.findOne({ where: condition })
        .then(data => {
            if(!data){
                res.status(404).send({
                    message: "No existe un artista: " + nombre_artista_recibido
                });
                return;
            }
            res.send(data);
        })
        .catch(() => {
            res.status(500).send({
                message: "Error al encontrar el artista: " + nombre_artista_recibido
            });
        });
};

exports.actualizarArtista = (req, res) => {
    const id_artista_recibido= req.params.id;

    ArtistasAPI.update(req.body, {
        where: {id_artista: id_artista_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Artista actualizado"
                });
            } else {
                res.stats(404).send({
                    message:  `Error al actualizar el Artssta id= ${id_artista_recibido}. Registro inexistente o valor nulo`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al actualizar el Artista con el id: " + id_artista_recibido
            });
        });
};

exports.eliminarArtista = (req, res) => {
    const id_artista_recibido = req.params.id;

    ArtistasAPI.destroy({
        where: {id_artista: id_artista_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Artista eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el Artista id= ${id_artista_recibido}. Artista inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el ususario con el id: " + id_artista_recibido
            });
        });
};