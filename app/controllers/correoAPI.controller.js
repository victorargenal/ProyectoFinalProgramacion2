const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const crypto = require("crypto");

const db = require("../models");

const EntradaAPI = db.entradaAPI;


const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

});


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

        const correo = req.body.correo;
        const nombreCliente = req.body.nombre_cliente;
        const idVenta = req.body.id_venta;
        const numeroFactura = req.body.numero_factura;
        const fechaVenta = req.body.fecha_venta;
        const metodoPago = req.body.metodo_pago;
        const total = req.body.total;
        const tickets = req.body.tickets;


        if (
            !correo ||
            !nombreCliente ||
            !idVenta ||
            !numeroFactura ||
            !Array.isArray(tickets)
        ) {

            return res.status(400).send({
                message: "Faltan datos para enviar el correo"
            });
        }


        /*
        ====================================
        BUSCAR SI LA VENTA YA TIENE QR
        ====================================
        */

        let entrada = await EntradaAPI.findOne({
            where: {
                id_venta_entrada: idVenta
            }
        });


        /*
        ====================================
        SI NO EXISTE, CREAR TOKEN
        ====================================
        */

        if (!entrada) {

            const token =
                    crypto
                        .randomBytes(32)
                        .toString("hex");


            entrada = await EntradaAPI.create({

                id_venta_entrada: idVenta,

                token: token,

                estado: "ACTIVA"
            });
        }


        /*
        ====================================
        URL QUE CONTENDRA EL QR
        ====================================
        */

        const baseUrl =
                process.env.BASE_URL ||
                "https://proyectofinalprogramacion2.onrender.com";


        const urlEntrada =
                `${baseUrl}/entrada/${entrada.token}`;


        /*
        ====================================
        GENERAR QR
        ====================================
        */

        const qrDataUrl =
                await QRCode.toDataURL(
                    urlEntrada,
                    {
                        errorCorrectionLevel: "M",
                        margin: 2,
                        width: 300
                    }
                );


        const qrBase64 =
                qrDataUrl.split(",")[1];


        const qrBuffer =
                Buffer.from(
                    qrBase64,
                    "base64"
                );


        /*
        ====================================
        CREAR FILAS DE TICKETS
        ====================================
        */

        let filasTickets = "";


        for (const ticket of tickets) {

            filasTickets += `
                <tr>
                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e5e7eb;
                    ">
                        ${escapar(ticket.nombre_boleto_carrito)}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e5e7eb;
                    ">
                        ${escapar(ticket.seccion)}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e5e7eb;
                        text-align:center;
                    ">
                        ${ticket.cantidad_tickets_comprados}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e5e7eb;
                        text-align:right;
                    ">
                        Q ${Number(ticket.precio).toFixed(2)}
                    </td>

                    <td style="
                        padding:12px;
                        border-bottom:1px solid #e5e7eb;
                        text-align:right;
                        font-weight:bold;
                    ">
                        Q ${Number(ticket.total_carrito).toFixed(2)}
                    </td>
                </tr>
            `;
        }


        /*
        ====================================
        CORREO
        ====================================
        */

        await transporter.sendMail({

            from:
                `"Sistema de Conciertos" <${process.env.SMTP_USER}>`,

            to: correo,

            subject:
                `🎫 Compra confirmada - ${numeroFactura}`,

            text:
                `Hola ${nombreCliente}. Tu compra ${numeroFactura} fue confirmada. Total: Q ${Number(total).toFixed(2)}. Conserva tu código QR para solicitar tu entrada al concierto.`,

            html: `

            <div style="
                background:#f4f7fb;
                padding:30px 15px;
                font-family:Arial,Helvetica,sans-serif;
                color:#24364b;
            ">

                <div style="
                    max-width:650px;
                    margin:auto;
                    background:#ffffff;
                    border-radius:16px;
                    overflow:hidden;
                ">


                    <!-- ENCABEZADO -->

                    <div style="
                        background:#12365B;
                        padding:30px;
                        color:white;
                    ">

                        <div style="
                            font-size:25px;
                            font-weight:bold;
                        ">
                            ¡Gracias por tu compra!
                        </div>

                        <div style="
                            margin-top:8px;
                            color:#d5e8f7;
                        ">
                            Tus entradas están listas
                        </div>

                    </div>


                    <div style="padding:30px;">


                        <p style="
                            font-size:17px;
                            margin-top:0;
                        ">
                            Hola
                            <strong>
                                ${escapar(nombreCliente)}
                            </strong>,
                        </p>


                        <p style="
                            color:#56687a;
                            line-height:1.6;
                        ">
                            Tu compra fue registrada correctamente.
                            A continuación encontrarás el resumen
                            de tus tickets y tu código QR de entrada.
                        </p>


                        <!-- DATOS VENTA -->

                        <div style="
                            background:#f5f9fd;
                            border-radius:10px;
                            padding:18px;
                            margin:25px 0;
                        ">

                            <div>
                                <strong>Factura:</strong>
                                ${escapar(numeroFactura)}
                            </div>

                            <div style="margin-top:8px;">
                                <strong>Fecha:</strong>
                                ${escapar(fechaVenta)}
                            </div>

                            <div style="margin-top:8px;">
                                <strong>Método de pago:</strong>
                                ${escapar(metodoPago)}
                            </div>

                        </div>


                        <!-- TABLA -->

                        <h3 style="
                            color:#12365B;
                            margin-top:30px;
                        ">
                            Tus tickets
                        </h3>


                        <div style="overflow-x:auto;">

                            <table style="
                                width:100%;
                                border-collapse:collapse;
                                font-size:14px;
                            ">

                                <thead>

                                    <tr style="
                                        background:#20618F;
                                        color:white;
                                    ">

                                        <th style="padding:12px;text-align:left;">
                                            Ticket
                                        </th>

                                        <th style="padding:12px;text-align:left;">
                                            Sección
                                        </th>

                                        <th style="padding:12px;">
                                            Cant.
                                        </th>

                                        <th style="padding:12px;text-align:right;">
                                            Precio
                                        </th>

                                        <th style="padding:12px;text-align:right;">
                                            Subtotal
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    ${filasTickets}

                                </tbody>

                            </table>

                        </div>


                        <!-- TOTAL -->

                        <div style="
                            text-align:right;
                            margin-top:25px;
                            font-size:20px;
                            color:#12365B;
                        ">

                            <strong>
                                Total:
                                Q ${Number(total).toFixed(2)}
                            </strong>

                        </div>


                        <!-- QR -->

                        <div style="
                            margin-top:40px;
                            text-align:center;
                            border-top:1px solid #e5e7eb;
                            padding-top:30px;
                        ">

                            <h2 style="
                                color:#12365B;
                                margin-bottom:10px;
                            ">
                                Tu código de entrada
                            </h2>


                            <p style="
                                color:#66788b;
                                line-height:1.5;
                            ">
                                Este código QR corresponde a toda
                                tu compra. Consérvalo y úsalo para
                                solicitar tu ingreso al concierto.
                            </p>


                            <img
                                src="cid:qrentrada"
                                width="230"
                                height="230"
                                alt="Código QR de entrada"
                                style="
                                    margin-top:15px;
                                    border-radius:10px;
                                "
                            />


                            <p style="
                                color:#98a6b5;
                                font-size:12px;
                                margin-top:15px;
                            ">
                                Un solo QR válido para esta compra.
                            </p>

                        </div>


                        <div style="
                            margin-top:35px;
                            padding:18px;
                            background:#edf6fb;
                            border-radius:10px;
                            color:#3b5368;
                            text-align:center;
                        ">

                            Presenta este código cuando quieras
                            solicitar tu entrada al evento.

                        </div>


                    </div>


                    <!-- FOOTER -->

                    <div style="
                        background:#f6f8fa;
                        padding:20px;
                        text-align:center;
                        color:#8898a8;
                        font-size:12px;
                    ">

                        Sistema de Gestión de Conciertos

                    </div>


                </div>

            </div>

            `,

            attachments: [

                {
                    filename:
                        `QR-${numeroFactura}.png`,

                    content:
                        qrBuffer,

                    cid:
                        "qrentrada"
                }

            ]

        });


        res.send({

            message:
                "Correo enviado correctamente",

            url_entrada:
                urlEntrada,

            estado:
                entrada.estado
        });


    } catch (error) {

        console.error(error);

        res.status(500).send({

            message:
                error.message ||
                "Error al enviar el correo"

        });
    }
};