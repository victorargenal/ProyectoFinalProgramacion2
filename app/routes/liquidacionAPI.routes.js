module.exports = app => {
    const liquidacionAPI = require("../controllers/liquidacionAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", liquidacionAPI.crearLiquidacion);

    router.get("/", liquidacionAPI.queryLiquidacion);

    router.delete("/delete/:id", liquidacionAPI.eliminarLiquidacion);

    app.use("/api/liquidacionAPI", router);
}