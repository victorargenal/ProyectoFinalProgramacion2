const db = require("../models");
const ConciertosAPI = db.conciertosAPI;
const Op = db.Sequelize.Op;

exports.crearConcierto = (req, res) => {
    if(!req.body.id_artista_concierto || !req.body.nombre_artista_concierto || !req.body.nombre_concierto || !req.body.fecha_concierto || !req.body.horario || !req.body.ubicacion || !req.body.estado_concierto || !req.body.capacidad_concierto){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const conciertosAPI ={
        id_artista_concierto: req.body.id_artista_concierto,
        nombre_artista_concierto: req.body.nombre_artista_concierto,
        nombre_concierto: req.body.nombre_concierto,
        fecha_concierto: req.body.fecha_concierto,
        horario: req.body.horario,
        ubicacion: req.body.ubicacion,
        estado_concierto: req.body.estado_concierto,
        capacidad_concierto: req.body.capacidad_concierto
    }

    ConciertosAPI.create(conciertosAPI)
    .then(() => {
        res.send({
            message: "Concierto creado correctamente"
        });
    })
    .catch(err => {
        res.status(500).send(({
            message:"Error al crear Concierto, Concierto con nombre duplicado" & err.message
        }));
    });
};

exports.queryConciertos = (req, res) => {
    ConciertosAPI.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:"error al encontrar los Conciertos" & err.message
        });
    });
};

exports.buscarFiltrosConcierto = (req, res) => {
const nombre_artista_concierto_recibido = req.query.nombre_artista_concierto;
const estado_concierto_recibido = req.query.estado_concierto;
    
    const condition = {}

    if(estado_concierto_recibido){
        condition.estado_concierto = estado_concierto_recibido
    }

    if(nombre_artista_concierto_recibido){
        condition.nombre_artista_concierto = {
            [Op.iLike]: `%${nombre_artista_concierto_recibido}%`
        }
    }

    ConciertosAPI.findAll({where: condition})
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:"Error al encontrar los Conciertos "  & err.message
        });
    });
};

exports.actualizarConcierto = (req, res) => {
    const id_concierto_recibido = req.params.id;

    ConciertosAPI.update(req.body, {
        where: {id_concierto: id_concierto_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Concierto actualizado"
                });
            } else {
                res.status(404).send({
                    message:  `Error al actualizar el Concierto id= ${id_concierto_recibido}. Registro inexistente o valor nulo`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al actualizar el Concierto con el id: " + id_concierto_recibido
            });
        });
};

exports.eliminarConcierto = (req, res) => {
    const id_concierto_recibido = req.params.id;

    ConciertosAPI.destroy({
        where: {id_concierto: id_concierto_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Concierto eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el concierto id= ${id_concierto_recibido}. Concierto inexistente`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el Concierto con el id: " + id_concierto_recibido
            });
        });
};