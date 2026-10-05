const db = require("../models");
const Detalle_ventasAPI = db.detalle_ventasAPI;
const Inventario_boletosAPI = db.inventario_boletosAPI;
const Op = db.Sequelize.Op;

exports.crearDetalle = async (req, res) => {
    if(!req.body.id_inventario_detalle || !req.body.cantidad_tickets_comprados || !req.body.subtotal){
        res.status(400).send({
                message: "Algun campo esta vacio, favor rellenarlo."
            });
            return;
    }
    const id_inventario_detalle_recibido = req.body.id_inventario_detalle;

    if(req.body.cantidad_tickets_comprados <=0 ){
        res.status(400).send({
                message: "La cantidad de tickets debe ser mayor a 0"
            });
            return;
    }

    try{
        // para llamar el registro completo
        const registro_de_inventario_boletos = await Inventario_boletosAPI.findByPk(id_inventario_detalle_recibido);

        if(!registro_de_inventario_boletos){
            res.status(404).send({
                message: "No existe el boleto seleccionado"
            })
            return;
        }


        const id_boleto_a_actualizar_recibida = registro_de_inventario_boletos.id_inventario;
        const cantidad_de_tickets_disponibles_recibida = registro_de_inventario_boletos.cantidad_tickets_disponible;
        
        const detalle_ventasAPI = {
            id_ventasReporte_detalle: req.body.id_ventasReporte_detalle, //id de la venta del vendedor
            id_inventario_detalle: req.body.id_inventario_detalle, //id del boleto
            cantidad_tickets_comprados: req.body.cantidad_tickets_comprados,
            subtotal: req.body.subtotal,
            items_comprados: req.body.items_comprados, //variable creada desde javva para el for y hacer update por cada ticket
        }

        if(cantidad_de_tickets_disponibles_recibida<req.body.cantidad_tickets_comprados){
            res.status(400).send({
                message: "No hay suficientes tickets disponibles"
            })
            return;
        }

        const nueva_cantidad_tickets_disponible = cantidad_de_tickets_disponibles_recibida-req.body.cantidad_tickets_comprados;

        await Detalle_ventasAPI.create(detalle_ventasAPI);//crear la venta



        if(nueva_cantidad_tickets_disponible === 0){
            await Inventario_boletosAPI.update(
                {
                    estado_ticket: "Agotado",
                    cantidad_tickets_disponible: 0
                },
                {
                    where: {id_inventario: id_boleto_a_actualizar_recibida}
                }
            );
        } else {
            await Inventario_boletosAPI.update(
                {
                    cantidad_tickets_disponible: nueva_cantidad_tickets_disponible
                },
                {
                    where: {id_inventario: id_boleto_a_actualizar_recibida}
                }
            );
        }
        res.send({
            message: "Detalle de venta creado correctamente"
        })
    }catch(err){
        res.status(500).send({
            message: err.message || "error al crear la venta"
        })
    }
};

exports.queryDetalle = (req, res) => {
    Inventario_boletosAPI.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:"error al encontrar los detalles" & err.message
        });
    });
};

exports.buscarIdVendedor = (req, res) => {
    const id_vendedor_recibido = req.query.id_ventasReporte_detalle;
    const condition= {
        id_ventasReporte_detalle: id_vendedor_recibido
    }

    Detalle_ventasAPI.findAll({ where: condition })
        .then(data => {
            if(data.length === 0){
                res.status(404).send({
                    message: "No existe un vendedor: " + id_vendedor_recibido
                });
                return;
            }
            res.send(data);
        })
        .catch(() => {
            res.status(500).send({
                message: "Error al encontrar el vendedor: " + id_vendedor_recibido
            });
        });
};

exports.eliminarDetalle = (req, res) => {
    const id_detalle_recibido = req.params.id;

    Detalle_ventasAPI.destroy({
        where: {id_detalle: id_detalle_recibido}
    })
        .then(num => {
            if (num == 1){
                res.send({
                message: "detalle eliminado correctamente"
                });
            } else {
                res.status(404).send({
                    message: `Erro al eliminar el detalle id= ${id_detalle_recibido}. detalle inexistente`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al eliminar el detalle con el id: " + id_detalle_recibido
            });
        });
};