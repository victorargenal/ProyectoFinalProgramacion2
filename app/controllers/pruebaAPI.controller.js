const db = require("../models");
const PruebaAPI = db.pruebaAPI;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    if(!req.body.nombre){
        res.status(400).send({
            message: "Contenido vacio, favor rellenarlo"
        });
        return;
    }

    const pruebaAPI = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        edad: req.body.edad
    };

    PruebaAPI.create(pruebaAPI)
        .then(data=> {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "error el crear cliente"
            });
        });
};

exports.findAll = (req, res) => {
    const nombre= req.query.nombre;
    var condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

    PruebaAPI.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "error al encontrar los registros"
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    PruebaAPI.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "error al encontrar el registro con el id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    PruebaAPI.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Registro Actualizado."
                });
            } else {
                res.send({
                    message: `no se pudo actualizar el registro id=${id}. tal vez el registro no existe, o existe un valor nulo`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "error al actualizar el registro id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;
    PruebaAPI.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Registro eliminado"
                });
            } else {
                res.send({
                    message: `no se pudo eliminar el registro id=${id}. El registro no fue encontado!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    PruebaAPI.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} registros eliminados` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "erro al eliminar todos los registros"
            });
        });
};

exports.id_y_nombre = (req, res) => {
    ArtistasAPI.findAll({
        attributes: [
            "id_artista"
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los artistas"
            });
        });
};