module.exports = app => {
    const ventas_reporteAPI = require("../controllers/ventas_reporteAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", ventas_reporteAPI.crearReporte);

    router.get("/filtroReporte", ventas_reporteAPI.buscarNombreReporte);

    router.get("/", ventas_reporteAPI.queryReporte);

    router.delete("/delete/:id", ventas_reporteAPI.eliminarReporte);

    app.use("/api/ventas_reporteAPI", router);
}