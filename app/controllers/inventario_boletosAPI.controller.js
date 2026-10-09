const db = require("../models");
const Inventario_boletosAPI = db.inventario_boletosAPI;
const Op = db.Sequelize.Op;

exports.crearBoletos = (req, res) => {
    if( !req.body.id_concierto_inventario || !req.body.nombre_boleto_inventario || !req.body.seccion || !req.body.precio || !req.body.cantidad_total || !req.body.cantidad_tickets_disponible){
            res.status(400).send({
                message: "Algun campo esta vacio, favor rellenarlo."
            });
            return;
    }

    const inventario_boletosAPI = {
        id_concierto_inventario: req.body.id_concierto_inventario,
        nombre_boleto_inventario: req.body.nombre_boleto_inventario,
        seccion: req.body.seccion,
        precio: req.body.precio,
        estado_ticket: req.body.estado_ticket,
        cantidad_total: req.body.cantidad_total,
        cantidad_tickets_disponible: req.body.cantidad_total
    }

    Inventario_boletosAPI.create(inventario_boletosAPI)
        .then(() => {
            res.send({
                message: "Ticket creado correctamente"
            });
        })
        .catch(() => {
            res.status(500).send({
                message: "Erro al crear Ticket"
            });
        });
};

exports.queryBoletos = (req, res) => {
    Inventario_boletosAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los boletos"
            });
        });
};

exports.actualizarBoletos = (req, res) => {
    const id_inventario_recibido= req.params.id;

    Inventario_boletosAPI.update(req.body, {
        where: {id_inventario: id_inventario_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "boleto actualizado"
                });
            } else {
                res.status(404).send({
                    message:  `Error al actualizar el boleto id= ${id_inventario_recibido}. Registro inexistente o valor nulo`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al actualizar el boleto con el id: " + id_inventario_recibido
            });
        });
};

exports.eliminarConcierto = (req, res) => {
    const id_inventario_recibido = req.params.id;

    Inventario_boletosAPI.destroy({
        where: {id_inventario: id_inventario_recibido}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "boleto eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el boleto id= ${id_inventario_recibido}. boleto inexistente`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el boleto con el id: " + id_inventario_recibido
            });
        });
};

exports.buscarFiltrosBoletos = (req, res) => {
    const nombre_boleto_inventario_recibido = req.query.nombre_boleto_inventario; //artista-nombre concierto
    const seccion_recibido = req.query.seccion;
    const estado_ticket_recibido = req.query.estado_ticket;

    const condition = {}

    if(seccion_recibido){
        condition.seccion = seccion
    }

    if(estado_ticket_recibido){
        condition.estado_ticket = estado_ticket
    }

    if(nombre_boleto_inventario_recibido){
        condition.nombre_boleto_inventario = nombre_boleto_inventario_recibidos
    }

    Inventario_boletosAPI.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los boletos "
            });
        });
};
