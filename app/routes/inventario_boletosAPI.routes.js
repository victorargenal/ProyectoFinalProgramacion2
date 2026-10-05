module.exports = app => {
    const inventario_boletosAPI = require("../controllers/inventario_boletosAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", inventario_boletosAPI.crearBoletos);

    router.get("/", inventario_boletosAPI.queryBoletos);

    router.get("/buscarFiltrosBoletos", inventario_boletosAPI.buscarFiltrosBoletos);

    router.put("/update/:id", inventario_boletosAPI.actualizarBoletos);

    router.delete("/delete/:id", inventario_boletosAPI.eliminarConcierto);

    app.use("/api/inventario_boletosAPI", router);
}