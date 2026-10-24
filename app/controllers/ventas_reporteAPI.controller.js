const db = require("../models");
const Ventas_reporteAPI = db.ventas_reporteAPI;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

exports.crearReporte = (req, res) => {
    if(!req.body.id_usuario_ventas || !req.body.nombre_usuario_ventas || !req.body.total_venta){
        res.status(400).send({
            message: "Algun campo esta vacio, favor rellenarlo."
        });
        return;
    }

    const ventas_reporteAPI = {
        id_usuario_ventas: req.body.id_usuario_ventas,
        nombre_usuario_ventas: req.body.nombre_usuario_ventas,
        metodo_pago: req.body.metodo_pago,
        total_venta: req.body.total_venta
    }

    Ventas_reporteAPI.create(ventas_reporteAPI)
        .then(() => {
            res.send({
                message: "Reporte creado correctamente"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear reporte"
            });
        });
};

exports.queryReporte = (req, res) => {
    Ventas_reporteAPI.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "error al encontrar los registros"
            });
        });
};

exports.buscarNombreReporte = (req, res) => {
    
    const nombre_recibido = req.query.nombre_usuario_ventas;
    const metodo_pago_recibido= req.query.metodo_pago;
    const anio_recibido = req.query.anio;
    const mes_recibido = req.query.mes;
    const dia_recibido = req.query.dia;

    const condition = {};
    const filtrosFecha = [];

    if (nombre_recibido) {
        condition.nombre_usuario_ventas = nombre_recibido;
    }

    if (metodo_pago_recibido) {
        condition.metodo_pago = metodo_pago_recibido;
    }

    if (anio_recibido) {
        filtrosFecha.push(
            Sequelize.where(
                Sequelize.fn(
                    "date_part",
                    "year",
                    Sequelize.col("fecha_venta")
                ),
                parseInt(anio_recibido)
            )
        );
    }

    if (mes_recibido) {
        filtrosFecha.push(
            Sequelize.where(
                Sequelize.fn(
                    "date_part",
                    "month",
                    Sequelize.col("fecha_venta")
                ),
                parseInt(mes_recibido)
            )
        );
    }

    if (dia_recibido) {
        filtrosFecha.push(
            Sequelize.where(
                Sequelize.fn(
                    "date_part",
                    "day",
                    Sequelize.col("fecha_venta")
                ),
                parseInt(dia_recibido)
            )
        );
    }

    if (filtrosFecha.length > 0) {
        condition[Op.and] = filtrosFecha;
    }


    Ventas_reporteAPI.findAll({
        where: condition
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message ||
                "Error al encontrar los reportes"
        });
    });

};

exports.eliminarReporte = (req, res) => {
    const id_reporte_recibido = req.params.id;

    Ventas_reporteAPI.destroy({
        where: {id_venta: id_reporte_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: "reporte eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el reporte id= ${id_reporte_recibido}. reporte inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el reporte con el id: " + id_reporte_recibido
            });
        });
};

