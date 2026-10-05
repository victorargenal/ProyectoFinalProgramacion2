module.exports = app => {
    const pruebaAPI = require("../controllers/pruebaAPI.controller.js");
    var router= require("express").Router();

    router.post("/create/", pruebaAPI.create);

    router.get("/:id", pruebaAPI.findOne);

    router.get("/", pruebaAPI.findAll);

    router.put("/update/:id", pruebaAPI.update);

    router.delete("/delete/:id", pruebaAPI.delete);

    router.delete("/delete/", pruebaAPI.deleteAll);

    app.use("/api/pruebaAPI", router);

}