module.exports = app => {
    const carritoAPI = require("../controllers/carritoAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", carritoAPI.crearCarrito);

    router.get("/", carritoAPI.querycarrito);

    router.delete("/delete/:id", carritoAPI.eliminarcarrito);

    router.delete("/delete/", carritoAPI.eliminarcarritoCompleto);

    app.use("/api/carritoAPI", router);
}