const { Resend } = require("resend");
const QRCode = require("qrcode");
const crypto = require("crypto");

const db = require("../models");
const EntradaAPI = db.entradaAPI;

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "vgallardoa@miumg.edu.gt";

const BASE_URL =
    process.env.BASE_URL ||
    "https://proyectofinalprogramacion2.onrender.com";

const ADMIN_SECRET =
    process.env.ADMIN_SECRET ||
    "proyecto-final-conciertos-2026";


function generarFirma(token, accion) {

    return crypto
        .createHmac("sha256", ADMIN_SECRET)
        .update(`${token}:${accion}`)
        .digest("hex");
}


function validarFirma(token, accion, firma) {

    if (!firma) {
        return false;
    }

    const firmaCorrecta =
        generarFirma(token, accion);

    if (firma.length !== firmaCorrecta.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        Buffer.from(firma),
        Buffer.from(firmaCorrecta)
    );
}


exports.crearEntrada = async (req, res) => {

    try {

        const idVenta =
            Number(req.body.id_venta);

        if (!idVenta) {

            return res.status(400).send({
                message: "ID de venta invalido"
            });

        }


        let entrada =
            await EntradaAPI.findOne({
                where: {
                    id_venta_entrada: idVenta
                }
            });


        if (!entrada) {

            const token =
                crypto
                    .randomBytes(32)
                    .toString("hex");

            entrada =
                await EntradaAPI.create({
                    id_venta_entrada: idVenta,
                    token: token,
                    estado: "ACTIVA"
                });

        }


        const urlEntrada =
            `${BASE_URL}/entrada/${entrada.token}`;


        const qrDataUrl =
            await QRCode.toDataURL(
                urlEntrada,
                {
                    errorCorrectionLevel: "M",
                    margin: 2,
                    width: 400
                }
            );


        const qrBase64 =
            qrDataUrl.split(",")[1];


        return res.send({
            message: "Entrada creada correctamente",
            url_entrada: urlEntrada,
            qr_base64: qrBase64,
            estado: entrada.estado
        });


    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message:
                error.message ||
                "Error al crear entrada"
        });

    }

};


exports.verEntrada = async (req, res) => {

    try {

        const token =
            req.params.token;


        const entrada =
            await EntradaAPI.findOne({
                where: {
                    token: token
                }
            });


        if (!entrada) {

            return res.status(404).send(`
                <h1>Entrada no encontrada</h1>
            `);

        }


        let contenido = "";


        if (entrada.estado === "ACTIVA") {

            contenido = `

                <div class="estado activa">
                    ENTRADA DISPONIBLE
                </div>

                <p>
                    Presiona el botón para solicitar
                    tu ingreso al evento.
                </p>

                <form
                    method="POST"
                    action="/entrada/${token}/solicitar"
                >

                    <button type="submit">
                        SOLICITAR ENTRADA
                    </button>

                </form>

            `;

        }


        if (entrada.estado === "SOLICITADA") {

            contenido = `

                <div class="estado esperando">
                    SOLICITUD ENVIADA
                </div>

                <div class="loader"></div>

                <p>
                    Esperando autorización...
                </p>

                <script>

                    setTimeout(
                        () => location.reload(),
                        3000
                    );

                </script>

            `;

        }


        if (entrada.estado === "APROBADA") {

            contenido = `

                <div class="check">
                    ✓
                </div>

                <div class="estado aprobada">
                    ENTRADA AUTORIZADA
                </div>

                <p>
                    Puedes ingresar al concierto.
                </p>

            `;

        }


        if (entrada.estado === "RECHAZADA") {

            contenido = `

                <div class="estado rechazada">
                    ENTRADA RECHAZADA
                </div>

                <p>
                    Tu solicitud de ingreso
                    fue rechazada.
                </p>

            `;

        }


        if (entrada.estado === "USADA") {

            contenido = `

                <div class="estado rechazada">
                    ENTRADA YA UTILIZADA
                </div>

            `;

        }


        return res.send(`

<!DOCTYPE html>

<html lang="es">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>
    Entrada
</title>

<style>

* {
    box-sizing: border-box;
}

body {

    margin: 0;

    font-family:
        Arial,
        Helvetica,
        sans-serif;

    background:
        #F3F6FA;

    color:
        #25364A;

}

.contenedor {

    min-height:
        100vh;

    display:
        flex;

    justify-content:
        center;

    align-items:
        center;

    padding:
        20px;

}

.tarjeta {

    width:
        100%;

    max-width:
        480px;

    background:
        white;

    border-radius:
        20px;

    overflow:
        hidden;

    box-shadow:
        0 15px 40px
        rgba(18,54,91,0.15);

}

.header {

    background:
        #12365B;

    color:
        white;

    text-align:
        center;

    padding:
        32px;

}

.header h1 {

    margin:
        0;

    font-size:
        26px;

}

.header p {

    color:
        #C7DAE9;

    margin-bottom:
        0;

}

.contenido {

    padding:
        32px;

    text-align:
        center;

}

.venta {

    color:
        #738497;

    font-size:
        13px;

    margin-bottom:
        25px;

}

.estado {

    padding:
        14px;

    border-radius:
        10px;

    font-weight:
        bold;

    margin-bottom:
        22px;

}

.activa {

    background:
        #EAF4FA;

    color:
        #20618F;

}

.esperando {

    background:
        #FFF4D6;

    color:
        #8A6700;

}

.aprobada {

    background:
        #E4F7EA;

    color:
        #19733A;

    font-size:
        18px;

}

.rechazada {

    background:
        #FCE8E8;

    color:
        #A32626;

}

button {

    width:
        100%;

    border:
        none;

    border-radius:
        10px;

    background:
        #12365B;

    color:
        white;

    padding:
        16px;

    font-size:
        15px;

    font-weight:
        bold;

    cursor:
        pointer;

}

button:hover {

    background:
        #174A78;

}

.check {

    width:
        80px;

    height:
        80px;

    border-radius:
        50%;

    background:
        #24A05A;

    color:
        white;

    margin:
        0 auto 20px;

    display:
        flex;

    align-items:
        center;

    justify-content:
        center;

    font-size:
        42px;

    font-weight:
        bold;

}

.loader {

    width:
        40px;

    height:
        40px;

    margin:
        25px auto;

    border:
        4px solid #E5EDF5;

    border-top:
        4px solid #20618F;

    border-radius:
        50%;

    animation:
        girar 1s linear infinite;

}

@keyframes girar {

    from {
        transform:
            rotate(0deg);
    }

    to {
        transform:
            rotate(360deg);
    }

}

</style>

</head>

<body>

<div class="contenedor">

    <div class="tarjeta">

        <div class="header">

            <h1>
                Entrada al concierto
            </h1>

            <p>
                Sistema de Gestión de Conciertos
            </p>

        </div>

        <div class="contenido">

            <div class="venta">
                Venta #${entrada.id_venta_entrada}
            </div>

            ${contenido}

        </div>

    </div>

</div>

</body>

</html>

        `);


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            "Error al cargar entrada"
        );

    }

};


exports.solicitarEntrada = async (req, res) => {

    try {

        const token =
            req.params.token;


        const entrada =
            await EntradaAPI.findOne({
                where: {
                    token: token
                }
            });


        if (!entrada) {

            return res.status(404).send(
                "Entrada no encontrada"
            );

        }


        if (entrada.estado !== "ACTIVA") {

            return res.redirect(
                `/entrada/${token}`
            );

        }


        entrada.estado =
            "SOLICITADA";

        await entrada.save();


        const firmaAprobar =
            generarFirma(
                token,
                "aprobar"
            );


        const firmaRechazar =
            generarFirma(
                token,
                "rechazar"
            );


        const urlAprobar =
            `${BASE_URL}/entrada/${token}/aprobar?firma=${firmaAprobar}`;


        const urlRechazar =
            `${BASE_URL}/entrada/${token}/rechazar?firma=${firmaRechazar}`;


        const resultado =
            await resend.emails.send({

                from:
                    "Sistema de Conciertos <onboarding@resend.dev>",

                to: [
                    ADMIN_EMAIL
                ],

                subject:
                    `Solicitud de entrada - Venta #${entrada.id_venta_entrada}`,

                html: `

                    <div
                        style="
                            font-family:Arial;
                            background:#F3F6FA;
                            padding:35px;
                        "
                    >

                        <div
                            style="
                                max-width:600px;
                                margin:auto;
                                background:white;
                                border-radius:15px;
                                overflow:hidden;
                            "
                        >

                            <div
                                style="
                                    background:#12365B;
                                    color:white;
                                    padding:28px;
                                "
                            >

                                <h2
                                    style="
                                        margin:0;
                                    "
                                >
                                    Solicitud de entrada
                                </h2>

                            </div>

                            <div
                                style="
                                    padding:30px;
                                    color:#25364A;
                                "
                            >

                                <p>
                                    La venta
                                    <strong>
                                        #${entrada.id_venta_entrada}
                                    </strong>
                                    está solicitando ingreso.
                                </p>

                                <div
                                    style="
                                        margin-top:30px;
                                    "
                                >

                                    <a
                                        href="${urlAprobar}"

                                        style="
                                            display:inline-block;
                                            background:#198754;
                                            color:white;
                                            text-decoration:none;
                                            padding:14px 20px;
                                            border-radius:8px;
                                            font-weight:bold;
                                            margin-right:10px;
                                        "
                                    >
                                        APROBAR
                                    </a>

                                    <a
                                        href="${urlRechazar}"

                                        style="
                                            display:inline-block;
                                            background:#B02A37;
                                            color:white;
                                            text-decoration:none;
                                            padding:14px 20px;
                                            border-radius:8px;
                                            font-weight:bold;
                                        "
                                    >
                                        RECHAZAR
                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                `

            });


        if (resultado.error) {

            entrada.estado =
                "ACTIVA";

            await entrada.save();

            console.error(
                resultado.error
            );

            return res.status(500).send(
                "No se pudo enviar la solicitud"
            );

        }


        return res.redirect(
            `/entrada/${token}`
        );


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            "Error al solicitar entrada"
        );

    }

};


exports.aprobarEntrada = async (req, res) => {

    try {

        const token =
            req.params.token;

        const firma =
            req.query.firma;


        if (
            !validarFirma(
                token,
                "aprobar",
                firma
            )
        ) {

            return res.status(403).send(
                "Autorizacion invalida"
            );

        }


        const entrada =
            await EntradaAPI.findOne({
                where: {
                    token: token
                }
            });


        if (!entrada) {

            return res.status(404).send(
                "Entrada no encontrada"
            );

        }


        entrada.estado =
            "APROBADA";

        await entrada.save();


        return res.send(`

            <div
                style="
                    font-family:Arial;
                    text-align:center;
                    padding:60px;
                "
            >

                <h1
                    style="
                        color:#198754;
                    "
                >
                    ✓ Entrada aprobada
                </h1>

                <h2>
                    Venta #${entrada.id_venta_entrada}
                </h2>

                <p>
                    El cliente ya puede ingresar.
                </p>

            </div>

        `);


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            "Error al aprobar entrada"
        );

    }

};


exports.rechazarEntrada = async (req, res) => {

    try {

        const token =
            req.params.token;

        const firma =
            req.query.firma;


        if (
            !validarFirma(
                token,
                "rechazar",
                firma
            )
        ) {

            return res.status(403).send(
                "Autorizacion invalida"
            );

        }


        const entrada =
            await EntradaAPI.findOne({
                where: {
                    token: token
                }
            });


        if (!entrada) {

            return res.status(404).send(
                "Entrada no encontrada"
            );

        }


        entrada.estado =
            "RECHAZADA";

        await entrada.save();


        return res.send(`

            <div
                style="
                    font-family:Arial;
                    text-align:center;
                    padding:60px;
                "
            >

                <h1
                    style="
                        color:#B02A37;
                    "
                >
                    Entrada rechazada
                </h1>

                <h2>
                    Venta #${entrada.id_venta_entrada}
                </h2>

            </div>

        `);


    } catch (error) {

        console.error(error);

        return res.status(500).send(
            "Error al rechazar entrada"
        );

    }

};