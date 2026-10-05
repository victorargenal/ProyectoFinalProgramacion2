require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

app.get("/", (req, res) => {
    res.json({ message: "Proyecto Final Programacion" });
});
//Hugario123_123_

///////////////////////////////////////////////////////////////////////////

//require("./app/routes/pruebaAPI.routes")(app);

require("./app/routes/usuariosAPI.routes")(app);

require("./app/routes/artistasAPI.routes")(app);

require("./app/routes/conciertosAPI.routes")(app);

require("./app/routes/inventario_boletosAPI.routes")(app);

require("./app/routes/detalle_ventasAPI.routes")(app);

require("./app/routes/clientes_registradosAPI.routes")(app);

require("./app/routes/ventas_reporteAPI.routes")(app);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});