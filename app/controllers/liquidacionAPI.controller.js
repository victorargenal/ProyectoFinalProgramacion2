const db = require("../models");
const LiquidacionAPI = db.liquidacionAPI;
const Op = db.Sequelize.Op;

exports.crearLiquidacion = (req, res) => {
    if(!req.body.nombre_vendedor){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const liquidacionAPI = {
        nombre_vendedor: req.body.nombre_vendedor,
        ganancia_tarjeta: req.body.ganancia_tarjeta,
        ganancia_efectivo: req.body.ganancia_efectivo,
        ganacia_total: req.body.ganacia_total,
        cierre_caja: req.body.cierre_caja
    };

    LiquidacionAPI.create(liquidacionAPI)
        .then(() => {
            res.send({
                message: "LiquidacionAPI creado correctamente"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear LiquidacionAPI"
            });
        });
};

exports.queryLiquidacion = (req, res) => {
    LiquidacionAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error al encontrar los registros"
            });
        });
};

exports.eliminarLiquidacion = (req, res) => {
    const id_usuario_recibido = req.params.id;

    LiquidacionAPI.destroy({
        where: {id_liquidacion: id_usuario_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: " eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el  id= ${id_usuario_recibido}.  inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar con el id: " + id_usuario_recibido
            });
        });
};