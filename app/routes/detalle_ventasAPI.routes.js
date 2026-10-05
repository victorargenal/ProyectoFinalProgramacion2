module.exports = app => {
    const detalle_ventasAPI = require("../controllers/detalle_ventasAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", detalle_ventasAPI.crearDetalle);

    router.get("/filtroDetalle", detalle_ventasAPI.buscarIdVendedor);

    router.get("/", detalle_ventasAPI.queryDetalle);

    router.delete("/delete/:id", detalle_ventasAPI.eliminarDetalle);

    app.use("/api/detalle_ventasAPI", router);
}