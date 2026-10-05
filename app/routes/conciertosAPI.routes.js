module.exports = app => {
    const conciertosAPI = require("../controllers/conciertosAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", conciertosAPI.crearConcierto);

    router.get("/", conciertosAPI.queryConciertos);

    router.get("/filtrosConcierto", conciertosAPI.buscarFiltrosConcierto);

    router.put("/update/:id", conciertosAPI.actualizarConcierto);

    router.delete("/delete/:id", conciertosAPI.eliminarConcierto);

    app.use("/api/conciertosAPI", router);
}