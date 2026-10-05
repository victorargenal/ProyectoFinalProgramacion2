module.exports = app => {
    const clientes_registradosAPI = require("../controllers/clientes_registradosAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", clientes_registradosAPI.crearCliente);

    router.get("/", clientes_registradosAPI.queryClientes);

    router.get("/nit/:nit_cliente", clientes_registradosAPI.buscarNit);

    router.delete("/delete/:id", clientes_registradosAPI.eliminarCliente);

    app.use("/api/clientes_registradosAPI", router);
}