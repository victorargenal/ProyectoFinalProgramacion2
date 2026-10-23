const db = require("../models");
const CarritoAPI = db.carritoAPI;
const Op = db.Sequelize.Op;

exports.crearCarrito = (req, res) => {
    if(!req.body.id_concierto_carrito || !req.body.nombre_boleto_carrito || !req.body.seccion || !req.body.precio || !req.body.cantidad_tickets_comprados){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const carritoAPI = {
        id_concierto_carrito: req.body.id_concierto_carrito,
        nombre_boleto_carrito: req.body.nombre_boleto_carrito,
        seccion: req.body.seccion,
        precio: req.body.precio,
        cantidad_tickets_comprados: req.body.cantidad_tickets_comprados
    };

    CarritoAPI.create(carritoAPI)
        .then(() => {
            res.send({
                message: "carrito creado correctamente"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear carrito"
            });
        });
};

exports.querycarrito = (req, res) => {
    CarritoAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error al encontrar los registros"
            });
        });
};

exports.eliminarcarrito = (req, res) => {
    const id_carrito_recibido = req.params.id;

    CarritoAPI.destroy({
        where: {id_carrito: id_carrito_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: "carrito eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el carrito id= ${id_carrito_recibido}. carrito inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el ususario con el id: " + id_carrito_recibido
            });
        });
};

