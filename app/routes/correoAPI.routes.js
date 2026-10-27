module.exports = app => {
    const correo = require("../controllers/correoAPI.controller.js");
    const router = require("express").Router();
    
    router.post("/",correo.enviarCorreoCompra);

    app.use("/correoCompra",router);
};