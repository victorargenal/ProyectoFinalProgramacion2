const db = require("../models");
const Ventas_reporteAPI = db.ventas_reporteAPI;
const Op = db.Sequelize.Op

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
    
    const condition = { 
        nombre_usuario_ventas: nombre_recibido 
    }
    
    Ventas_reporteAPI.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al encontrar los reportes "
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