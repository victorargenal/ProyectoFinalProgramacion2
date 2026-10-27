const { Resend } = require("resend");
const crypto = require("crypto");

const db = require("../models");

const EntradaAPI = db.entradaAPI;
const DetalleVentasAPI = db.detalle_ventasAPI;
const InventarioBoletosAPI = db.inventario_boletosAPI;

const resend = new Resend(
    process.env.RESEND_API_KEY
);



function escapar(texto) {

    if (texto == null) {
        return "";
    }

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



function generarFirma(token, accion) {

    return crypto
        .createHmac(
            "sha256",
            process.env.ADMIN_SECRET
        )
        .update(
            `${token}:${accion}`
        )
        .digest("hex");
}



function validarFirma(
    token,
    accion,
    firmaRecibida
) {

    if (!firmaRecibida) {
        return false;
    }

    const firmaCorrecta =
        generarFirma(
            token,
            accion
        );


    if (
        firmaRecibida.length !==
        firmaCorrecta.length
    ) {

        return false;
    }


    return crypto.timingSafeEqual(
        Buffer.from(firmaRecibida),
        Buffer.from(firmaCorrecta)
    );
}



async function obtenerTickets(idVenta) {

    const detalles =
        await DetalleVentasAPI.findAll({

            where: {

                id_ventasReporte_detalle:
                    idVenta

            }

        });


    const tickets = [];


    for (const detalle of detalles) {

        const inventario =
            await InventarioBoletosAPI.findByPk(
                detalle.id_inventario_detalle
            );


        tickets.push({

            nombre:
                inventario
                    ? inventario.nombre_boleto_inventario
                    : "Ticket",

            seccion:
                inventario
                    ? inventario.seccion
                    : "",

            cantidad:
                detalle.cantidad_tickets_comprados,

            subtotal:
                detalle.subtotal

        });

    }


    return tickets;
}


exports.verEntrada =
async (req, res) => {

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

            return res
                .status(404)
                .send(`

                    <h1>
                        Entrada no encontrada
                    </h1>

                `);

        }


        const tickets =
            await obtenerTickets(
                entrada.id_venta_entrada
            );


        let filasTickets = "";


        for (const ticket of tickets) {

            filasTickets += `

                <div class="ticket">

                    <div>

                        <strong>
                            ${escapar(ticket.nombre)}
                        </strong>

                        <div class="secondary">
                            ${escapar(ticket.seccion)}
                        </div>

                    </div>


                    <div class="cantidad">

                        x${ticket.cantidad}

                    </div>

                </div>

            `;

        }


        let contenidoEstado = "";



        if (entrada.estado === "ACTIVA") {

            contenidoEstado = `

                <div class="status activa">

                    Entrada disponible

                </div>


                <p class="mensaje">

                    Cuando estés listo para ingresar,
                    solicita tu entrada.

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



        else if (
            entrada.estado === "SOLICITADA"
        ) {

            contenidoEstado = `

                <div class="status esperando">

                    Solicitud enviada

                </div>


                <div class="loader"></div>


                <p class="mensaje">

                    Esperando autorización
                    para ingresar...

                </p>


                <p class="small">

                    Esta página se actualizará
                    automáticamente.

                </p>


                <script>

                    setTimeout(
                        () => location.reload(),
                        4000
                    );

                </script>

            `;

        }



        else if (
            entrada.estado === "APROBADA"
        ) {

            contenidoEstado = `

                <div class="check">
                    ✓
                </div>


                <div class="status aprobada">

                    ENTRADA AUTORIZADA

                </div>


                <p class="mensaje">

                    Tu solicitud fue aprobada.

                </p>


                <p class="entradaPermitida">

                    Puedes ingresar al concierto.

                </p>

            `;

        }



        else if (
            entrada.estado === "RECHAZADA"
        ) {

            contenidoEstado = `

                <div class="status rechazada">

                    Entrada no autorizada

                </div>


                <p class="mensaje">

                    Tu solicitud de ingreso
                    fue rechazada.

                </p>

            `;

        }



        else if (
            entrada.estado === "USADA"
        ) {

            contenidoEstado = `

                <div class="status rechazada">

                    ENTRADA YA UTILIZADA

                </div>

            `;

        }

        res.send(`

<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Entrada al concierto
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
                #f3f6fa;

            color:
                #25364A;

        }


        .page {

            min-height: 100vh;

            display: flex;

            justify-content: center;

            align-items: center;

            padding: 25px 15px;

        }


        .card {

            width: 100%;

            max-width: 520px;

            background:
                white;

            border-radius:
                20px;

            overflow:
                hidden;

            box-shadow:
                0 15px 45px
                rgba(
                    18,
                    54,
                    91,
                    0.14
                );

        }


        .header {

            background:
                #12365B;

            color:
                white;

            padding:
                32px;

            text-align:
                center;

        }


        .header h1 {

            margin:
                0;

            font-size:
                27px;

        }


        .header p {

            margin:
                8px 0 0;

            color:
                #CFE4F4;

        }


        .content {

            padding:
                30px;

        }


        .venta {

            color:
                #718295;

            font-size:
                13px;

            margin-bottom:
                25px;

            text-align:
                center;

        }


        .ticketsTitle {

            color:
                #12365B;

            font-size:
                14px;

            font-weight:
                bold;

            margin-bottom:
                10px;

        }


        .ticket {

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            padding:
                14px;

            background:
                #F4F8FC;

            border-radius:
                10px;

            margin-bottom:
                8px;

        }


        .secondary {

            color:
                #788A9D;

            font-size:
                13px;

            margin-top:
                4px;

        }


        .cantidad {

            font-weight:
                bold;

            color:
                #20618F;

            font-size:
                17px;

        }


        .status {

            margin-top:
                30px;

            padding:
                13px;

            border-radius:
                10px;

            text-align:
                center;

            font-weight:
                bold;

        }


        .activa {

            background:
                #EDF6FB;

            color:
                #20618F;

        }


        .esperando {

            background:
                #FFF5D9;

            color:
                #8B6800;

        }


        .aprobada {

            background:
                #E7F8ED;

            color:
                #19733A;

            font-size:
                19px;

        }


        .rechazada {

            background:
                #FDECEC;

            color:
                #A32626;

        }


        .mensaje {

            text-align:
                center;

            color:
                #5F7184;

            line-height:
                1.5;

            margin:
                22px 0;

        }


        button {

            width:
                100%;

            border:
                none;

            border-radius:
                10px;

            padding:
                16px;

            background:
                #12365B;

            color:
                white;

            font-weight:
                bold;

            font-size:
                15px;

            cursor:
                pointer;

        }


        button:hover {

            background:
                #174A78;

        }


        .check {

            width:
                75px;

            height:
                75px;

            margin:
                30px auto 15px;

            border-radius:
                50%;

            background:
                #24A05A;

            color:
                white;

            display:
                flex;

            align-items:
                center;

            justify-content:
                center;

            font-size:
                40px;

            font-weight:
                bold;

        }


        .entradaPermitida {

            text-align:
                center;

            font-weight:
                bold;

            color:
                #19733A;

            font-size:
                18px;

        }


        .small {

            text-align:
                center;

            font-size:
                12px;

            color:
                #98A5B3;

        }


        .loader {

            width:
                38px;

            height:
                38px;

            margin:
                25px auto;

            border:
                4px solid #E5EDF5;

            border-top:
                4px solid #20618F;

            border-radius:
                50%;

            animation:
                spin 1s linear infinite;

        }


        @keyframes spin {

            from {
                transform:
                    rotate(0deg);
            }

            to {
                transform:
                    rotate(360deg);
            }

        }


        .footer {

            background:
                #F7F9FB;

            color:
                #96A2AF;

            font-size:
                11px;

            padding:
                17px;

            text-align:
                center;

        }


    </style>

</head>


<body>


<div class="page">


    <div class="card">


        <div class="header">

            <h1>
                Entrada al concierto
            </h1>

            <p>
                Sistema de Gestión de Conciertos
            </p>

        </div>


        <div class="content">


            <div class="venta">

                Compra #${entrada.id_venta_entrada}

            </div>


            <div class="ticketsTitle">

                TUS TICKETS

            </div>


            ${filasTickets}


            ${contenidoEstado}


        </div>


        <div class="footer">

            Código de entrada único
            para esta compra

        </div>


    </div>


</div>


</body>

</html>

        `);


    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send(
                "Error al cargar la entrada"
            );

    }

};



exports.solicitarEntrada =
async (req, res) => {

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

            return res
                .status(404)
                .send(
                    "Entrada no encontrada"
                );

        }


        if (
            entrada.estado !== "ACTIVA"
        ) {

            return res.redirect(
                `/entrada/${token}`
            );

        }


        entrada.estado =
            "SOLICITADA";

        await entrada.save();



        const baseUrl =
            process.env.BASE_URL;


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

            `${baseUrl}/entrada/${token}/aprobar?firma=${firmaAprobar}`;


        const urlRechazar =

            `${baseUrl}/entrada/${token}/rechazar?firma=${firmaRechazar}`;


        const tickets =
            await obtenerTickets(
                entrada.id_venta_entrada
            );


        let listaTickets = "";


        for (const ticket of tickets) {

            listaTickets += `

                <li style="
                    margin-bottom:8px;
                ">

                    ${escapar(ticket.nombre)}

                    -

                    ${escapar(ticket.seccion)}

                    x${ticket.cantidad}

                </li>

            `;

        }



        const resultado =
            await resend.emails.send({

                from:
                    "Sistema de Conciertos <onboarding@resend.dev>",

                to: [
                    process.env.ADMIN_EMAIL
                ],

                subject:
                    `Solicitud de entrada - Venta #${entrada.id_venta_entrada}`,

                html: `

                    <div style="
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;

                        background:
                            #f4f7fb;

                        padding:
                            30px;
                    ">


                        <div style="
                            max-width:
                                600px;

                            margin:
                                auto;

                            background:
                                white;

                            padding:
                                30px;

                            border-radius:
                                15px;
                        ">


                            <h2 style="
                                color:#12365B;
                            ">

                                Solicitud de entrada

                            </h2>


                            <p>

                                La compra

                                <strong>

                                    #${entrada.id_venta_entrada}

                                </strong>

                                está solicitando ingreso
                                al concierto.

                            </p>


                            <h3>
                                Tickets
                            </h3>


                            <ul>

                                ${listaTickets}

                            </ul>


                            <div style="
                                margin-top:
                                    30px;
                            ">


                                <a
                                    href="${urlAprobar}"

                                    style="
                                        display:inline-block;
                                        background:#198754;
                                        color:white;
                                        text-decoration:none;
                                        padding:14px 22px;
                                        border-radius:8px;
                                        font-weight:bold;
                                        margin-right:10px;
                                    "
                                >

                                    APROBAR ENTRADA

                                </a>


                                <a
                                    href="${urlRechazar}"

                                    style="
                                        display:inline-block;
                                        background:#B02A37;
                                        color:white;
                                        text-decoration:none;
                                        padding:14px 22px;
                                        border-radius:8px;
                                        font-weight:bold;
                                    "
                                >

                                    RECHAZAR

                                </a>


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


            return res
                .status(500)
                .send(
                    "No se pudo enviar la solicitud"
                );

        }


        res.redirect(
            `/entrada/${token}`
        );


    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send(
                "Error al solicitar entrada"
            );

    }

};



exports.aprobarEntrada =
async (req, res) => {

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

            return res
                .status(403)
                .send(
                    "Autorización inválida"
                );

        }


        const entrada =
            await EntradaAPI.findOne({

                where: {
                    token: token
                }

            });


        if (!entrada) {

            return res
                .status(404)
                .send(
                    "Entrada no encontrada"
                );

        }


        entrada.estado =
            "APROBADA";

        await entrada.save();


        res.send(`

            <div style="
                font-family:Arial;
                text-align:center;
                padding:60px;
            ">

                <h1 style="
                    color:#198754;
                ">

                    ✓ Entrada aprobada

                </h1>


                <p>

                    Venta
                    #${entrada.id_venta_entrada}

                </p>


                <p>

                    El cliente ya puede
                    ingresar al concierto.

                </p>

            </div>

        `);


    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send(
                "Error al aprobar entrada"
            );

    }

};



exports.rechazarEntrada =
async (req, res) => {

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

            return res
                .status(403)
                .send(
                    "Autorización inválida"
                );

        }


        const entrada =
            await EntradaAPI.findOne({

                where: {
                    token: token
                }

            });


        if (!entrada) {

            return res
                .status(404)
                .send(
                    "Entrada no encontrada"
                );

        }


        entrada.estado =
            "RECHAZADA";

        await entrada.save();


        res.send(`

            <div style="
                font-family:Arial;
                text-align:center;
                padding:60px;
            ">

                <h1 style="
                    color:#B02A37;
                ">

                    Entrada rechazada

                </h1>


                <p>

                    Venta
                    #${entrada.id_venta_entrada}

                </p>

            </div>

        `);


    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send(
                "Error al rechazar entrada"
            );

    }

};