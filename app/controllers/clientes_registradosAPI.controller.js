const db = require("../models");
const Clientes_registradosAPI = db.clientes_registradosAPI;
const Op = db.Sequelize.Op;

exports.crearCliente = (req, res) => {
    if(!req.body.nombre_completo_cliente || !req.body.nit_cliente || !req.body.correo_cliente || !req.body.telefono_cliente){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const clientes_registradosAPI = {
        nombre_completo_cliente: req.body.nombre_completo_cliente,
        nit_cliente: req.body.nit_cliente,
        correo_cliente: req.body.correo_cliente,
        telefono_cliente: req.body.telefono_cliente
    }

    Clientes_registradosAPI.create(clientes_registradosAPI)
        .then(() => {
            res.send({
                message: "cliente creado correctamente"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear cliente"
            });
        });
};

exports.queryClientes = (req, res) => {
    Clientes_registradosAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error al encontrar los registros"
            });
        });
};

exports.buscarNit = (req, res) => {
    const nit_buscado = req.params.nit_cliente;

    const condition = {
        nit_cliente: nit_buscado
    }

    Clientes_registradosAPI.findOne({where: condition})
        .then(data => {
            if(!data) {
                res.status(404).send({
                    message: "No existe un cliente con el NIT: " + nit_buscado
                });
                return;
            }
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar el nit "
            });
        });
}; 

exports.eliminarCliente = (req, res) => {
    const id_cliente_recibido = req.params.id;

    Clientes_registradosAPI.destroy({
        where: {id_cliente: id_cliente_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: "cliente eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el cliente id= ${id_cliente_recibido}. cliente inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el ususario con el id: " + cliente
            });
        });
};