const { Resend } = require("resend");
const QRCode = require("qrcode");
const crypto = require("crypto");

const db = require("../models");

const EntradaAPI = db.entradaAPI;

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


exports.enviarCorreoCompra = async (req, res) => {

    try {

        const correo =
            req.body.correo;

        const nombreCliente =
            req.body.nombre_cliente;

        const idVenta =
            req.body.id_venta;

        const numeroFactura =
            req.body.numero_factura;

        const fechaVenta =
            req.body.fecha_venta;

        const metodoPago =
            req.body.metodo_pago;

        const total =
            req.body.total;

        const tickets =
            req.body.tickets;


        if (
            !correo ||
            !nombreCliente ||
            !idVenta ||
            !numeroFactura ||
            !tickets
        ) {

            return res.status(400).send({

                message:
                    "Faltan datos para enviar el correo"

            });

        }


        let entrada =
            await EntradaAPI.findOne({

                where: {

                    id_venta_entrada:
                        idVenta

                }

            });


        if (!entrada) {

            const token =
                crypto
                    .randomBytes(32)
                    .toString("hex");


            entrada =
                await EntradaAPI.create({

                    id_venta_entrada:
                        idVenta,

                    token:
                        token,

                    estado:
                        "ACTIVA"

                });

        }


        const baseUrl =
            process.env.BASE_URL
            ||
            "https://proyectofinalprogramacion2.onrender.com";


        const urlEntrada =
            `${baseUrl}/entrada/${entrada.token}`;


        const qrDataUrl =
            await QRCode.toDataURL(
                urlEntrada,
                {
                    errorCorrectionLevel:
                        "M",

                    margin:
                        2,

                    width:
                        350
                }
            );


        const qrBase64 =
            qrDataUrl.split(",")[1];


        let filasTickets = "";


        for (const ticket of tickets) {

            const nombreBoleto =
                escapar(
                    ticket.nombre_boleto_carrito
                );

            const seccion =
                escapar(
                    ticket.seccion
                );

            const precio =
                Number(
                    ticket.precio || 0
                );

            const cantidad =
                Number(
                    ticket.cantidad_tickets_comprados || 0
                );

            const subtotal =
                Number(
                    ticket.total_carrito || 0
                );


            filasTickets += `

                <tr>

                    <td
                        style="
                            padding:14px 10px;
                            border-bottom:1px solid #E4EBF2;
                            color:#26384A;
                            font-size:14px;
                        "
                    >

                        <strong>
                            ${nombreBoleto}
                        </strong>

                    </td>


                    <td
                        style="
                            padding:14px 10px;
                            border-bottom:1px solid #E4EBF2;
                            color:#65788A;
                            font-size:14px;
                            text-align:center;
                        "
                    >

                        ${seccion}

                    </td>


                    <td
                        style="
                            padding:14px 10px;
                            border-bottom:1px solid #E4EBF2;
                            color:#65788A;
                            font-size:14px;
                            text-align:center;
                        "
                    >

                        ${cantidad}

                    </td>


                    <td
                        style="
                            padding:14px 10px;
                            border-bottom:1px solid #E4EBF2;
                            color:#65788A;
                            font-size:14px;
                            text-align:right;
                        "
                    >

                        Q${precio.toFixed(2)}

                    </td>


                    <td
                        style="
                            padding:14px 10px;
                            border-bottom:1px solid #E4EBF2;
                            color:#12365B;
                            font-size:14px;
                            font-weight:bold;
                            text-align:right;
                        "
                    >

                        Q${subtotal.toFixed(2)}

                    </td>

                </tr>

            `;

        }


        const htmlCorreo = `

<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

</head>


<body
    style="
        margin:0;
        padding:0;
        background:#F1F5F9;
        font-family:Arial, Helvetica, sans-serif;
    "
>


<table
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
        background:#F1F5F9;
        padding:35px 15px;
    "
>

<tr>

<td align="center">


<table
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="
        max-width:700px;
        background:white;
        border-radius:18px;
        overflow:hidden;
        box-shadow:0 10px 35px rgba(18,54,91,0.12);
    "
>


<tr>

<td
    style="
        background:#12365B;
        padding:32px 35px;
    "
>

    <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
    >

        <tr>

            <td>

                <div
                    style="
                        color:#59C3E8;
                        font-size:12px;
                        font-weight:bold;
                        letter-spacing:2px;
                        margin-bottom:8px;
                    "
                >

                    SISTEMA DE CONCIERTOS

                </div>


                <div
                    style="
                        color:white;
                        font-size:28px;
                        font-weight:bold;
                    "
                >

                    Compra confirmada

                </div>


                <div
                    style="
                        color:#C8D9E8;
                        font-size:14px;
                        margin-top:8px;
                    "
                >

                    Gracias por tu compra

                </div>

            </td>


            <td
                align="right"
                style="
                    color:white;
                    vertical-align:top;
                "
            >

                <div
                    style="
                        font-size:12px;
                        color:#AFC5D8;
                    "
                >

                    FACTURA

                </div>


                <div
                    style="
                        font-size:18px;
                        font-weight:bold;
                        margin-top:5px;
                    "
                >

                    ${escapar(numeroFactura)}

                </div>

            </td>

        </tr>

    </table>

</td>

</tr>


<tr>

<td
    style="
        padding:35px;
    "
>


    <div
        style="
            color:#12365B;
            font-size:20px;
            font-weight:bold;
            margin-bottom:6px;
        "
    >

        Hola, ${escapar(nombreCliente)}

    </div>


    <div
        style="
            color:#718295;
            font-size:14px;
            line-height:1.6;
            margin-bottom:28px;
        "
    >

        Tu compra fue registrada correctamente.
        A continuación encontrarás los detalles
        y tu código QR de entrada.

    </div>


    <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            background:#F7FAFC;
            border-radius:12px;
            margin-bottom:30px;
        "
    >

        <tr>

            <td
                style="
                    padding:18px;
                "
            >

                <div
                    style="
                        color:#8797A8;
                        font-size:11px;
                        font-weight:bold;
                    "
                >

                    FECHA

                </div>


                <div
                    style="
                        color:#26384A;
                        font-size:14px;
                        font-weight:bold;
                        margin-top:5px;
                    "
                >

                    ${escapar(fechaVenta)}

                </div>

            </td>


            <td
                style="
                    padding:18px;
                "
            >

                <div
                    style="
                        color:#8797A8;
                        font-size:11px;
                        font-weight:bold;
                    "
                >

                    MÉTODO DE PAGO

                </div>


                <div
                    style="
                        color:#26384A;
                        font-size:14px;
                        font-weight:bold;
                        margin-top:5px;
                    "
                >

                    ${escapar(metodoPago)}

                </div>

            </td>


            <td
                style="
                    padding:18px;
                "
            >

                <div
                    style="
                        color:#8797A8;
                        font-size:11px;
                        font-weight:bold;
                    "
                >

                    VENTA

                </div>


                <div
                    style="
                        color:#26384A;
                        font-size:14px;
                        font-weight:bold;
                        margin-top:5px;
                    "
                >

                    #${idVenta}

                </div>

            </td>

        </tr>

    </table>


    <div
        style="
            color:#12365B;
            font-size:15px;
            font-weight:bold;
            margin-bottom:12px;
        "
    >

        DETALLE DE TICKETS

    </div>


    <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            border-collapse:collapse;
            margin-bottom:25px;
        "
    >

        <thead>

            <tr
                style="
                    background:#EAF4FA;
                "
            >

                <th
                    align="left"
                    style="
                        padding:12px 10px;
                        color:#20618F;
                        font-size:12px;
                    "
                >
                    BOLETO
                </th>


                <th
                    style="
                        padding:12px 10px;
                        color:#20618F;
                        font-size:12px;
                    "
                >
                    SECCIÓN
                </th>


                <th
                    style="
                        padding:12px 10px;
                        color:#20618F;
                        font-size:12px;
                    "
                >
                    CANT.
                </th>


                <th
                    align="right"
                    style="
                        padding:12px 10px;
                        color:#20618F;
                        font-size:12px;
                    "
                >
                    PRECIO
                </th>


                <th
                    align="right"
                    style="
                        padding:12px 10px;
                        color:#20618F;
                        font-size:12px;
                    "
                >
                    SUBTOTAL
                </th>

            </tr>

        </thead>


        <tbody>

            ${filasTickets}

        </tbody>

    </table>


    <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            margin-bottom:35px;
        "
    >

        <tr>

            <td></td>


            <td
                width="260"
                style="
                    background:#12365B;
                    border-radius:12px;
                    padding:20px;
                "
            >

                <table
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                >

                    <tr>

                        <td
                            style="
                                color:#C5D7E6;
                                font-size:13px;
                            "
                        >

                            TOTAL PAGADO

                        </td>


                        <td
                            align="right"
                            style="
                                color:white;
                                font-size:24px;
                                font-weight:bold;
                            "
                        >

                            Q${Number(total || 0).toFixed(2)}

                        </td>

                    </tr>

                </table>

            </td>

        </tr>

    </table>


    <table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            background:#F4F8FC;
            border-radius:16px;
        "
    >

        <tr>

            <td
                align="center"
                style="
                    padding:30px;
                "
            >

                <div
                    style="
                        color:#12365B;
                        font-size:18px;
                        font-weight:bold;
                        margin-bottom:8px;
                    "
                >

                    Tu código de entrada

                </div>


                <div
                    style="
                        color:#75879A;
                        font-size:13px;
                        line-height:1.5;
                        margin-bottom:20px;
                    "
                >

                    Escanea este código QR cuando
                    quieras solicitar tu ingreso.

                </div>


                <img
                    src="cid:qrentrada"
                    width="220"
                    height="220"
                    alt="Código QR de entrada"
                    style="
                        display:block;
                        margin:auto;
                        background:white;
                        padding:10px;
                        border-radius:12px;
                    "
                >


                <div
                    style="
                        margin-top:20px;
                        color:#8797A8;
                        font-size:12px;
                    "
                >

                    Un código QR único por compra

                </div>


                <div
                    style="
                        margin-top:18px;
                    "
                >

                    <a
                        href="${urlEntrada}"
                        style="
                            display:inline-block;
                            background:#20618F;
                            color:white;
                            text-decoration:none;
                            font-size:13px;
                            font-weight:bold;
                            padding:13px 22px;
                            border-radius:8px;
                        "
                    >

                        ABRIR ENTRADA

                    </a>

                </div>

            </td>

        </tr>

    </table>


</td>

</tr>


<tr>

<td
    align="center"
    style="
        background:#F8FAFC;
        padding:22px;
        color:#9AA7B4;
        font-size:11px;
        line-height:1.5;
    "
>

    Conserva este correo hasta finalizar
    tu ingreso al evento.

    <br>

    Sistema de Gestión de Conciertos

</td>

</tr>


</table>


</td>

</tr>

</table>


</body>

</html>

        `;


        const resultado =
            await resend.emails.send({

                from:
                    "Sistema de Conciertos <onboarding@resend.dev>",

                to: [
                    correo
                ],

                subject:
                    `Compra confirmada - ${numeroFactura}`,

                html:
                    htmlCorreo,

                attachments: [

                    {

                        filename:
                            `QR-${numeroFactura}.png`,

                        content:
                            qrBase64,

                        contentId:
                            "qrentrada"

                    }

                ]

            });


        if (resultado.error) {

            console.error(
                "ERROR RESEND:",
                resultado.error
            );


            return res.status(500).send({

                message:
                    resultado.error.message
                    ||
                    "Error al enviar correo"

            });

        }


        res.send({

            message:
                "Correo enviado correctamente",

            url_entrada:
                urlEntrada,

            estado:
                entrada.estado,

            id_correo:
                resultado.data?.id
                || null

        });


    } catch (error) {

        console.error(
            "ERROR CORREO:",
            error
        );


        res.status(500).send({

            message:
                error.message
                ||
                "Error al enviar correo"

        });

    }

};