module.exports = app => {

    const entrada =require("../controllers/entradaAPI.controller.js");
    const router =require("express").Router();

    router.get("/:token",entrada.verEntrada);

    router.post("/:token/solicitar",entrada.solicitarEntrada);

    router.get("/:token/aprobar",entrada.aprobarEntrada);

    router.get("/:token/rechazar",entrada.rechazarEntrada);

    app.use("/entrada",router);

};