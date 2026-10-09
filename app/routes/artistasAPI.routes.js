module.exports = app => {
    const artistasAPI = require("../controllers/artistasAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", artistasAPI.crearArtista);

    router.get("/", artistasAPI.queryArtistas);

    router.get("/nombre/:nombre_artista", artistasAPI.buscarNombre);

    router.get("/:id", artistasAPI.buscarIdArtista);

    router.put("/update/:id", artistasAPI.actualizarArtista);

    router.delete("/delete/:id", artistasAPI.eliminarArtista);

    app.use("/api/artistasAPI", router);
}