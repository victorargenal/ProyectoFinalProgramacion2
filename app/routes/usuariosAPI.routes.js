module.exports = app => {
    const usuariosAPI = require("../controllers/usuariosAPI.controller.js");
    var router = require("express").Router();

    router.post("/create/", usuariosAPI.crearUsuario);

    router.post("/login", usuariosAPI.loginUsuario);

    router.get("/filtrosUsuario", usuariosAPI.buscarFiltros);

    router.get("/", usuariosAPI.queryUsarios);

    router.get("/:id", usuariosAPI.buscarId);

    router.put("/update/:id", usuariosAPI.actualizarUsuario);

    router.delete("/delete/:id", usuariosAPI.eliminarUsario);

    app.use("/api/usuariosAPI", router);
}