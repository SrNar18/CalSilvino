import nodemailer from 'nodemailer';
import { initFirebase } from './lib/utils.js';

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    const { nombre, telefono, email, personas, fecha, turno, hora, mensaje } = body;

    if (!nombre || !telefono || !email || !personas || !fecha || !turno) {
        return Response.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar variables de entorno
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.error('submit-reserva: FIREBASE_SERVICE_ACCOUNT no configurada');
        return Response.json({ error: 'Error de configuración del servidor (FB)' }, { status: 500 });
    }
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error('submit-reserva: GMAIL_USER o GMAIL_PASS no configuradas');
        return Response.json({ error: 'Error de configuración del servidor (MAIL)' }, { status: 500 });
    }

    let db, docRef;
    try {
        db = initFirebase();
    } catch (err) {
        console.error('submit-reserva Firebase init error:', err);
        return Response.json({ error: 'Error al conectar con la base de datos' }, { status: 500 });
    }

    try {
        docRef = await db.collection('reservaciones').add({
            nombre,
            telefono,
            email,
            personas: Number(personas),
            fecha,
            turno,
            hora: hora || '',
            mensaje: mensaje || '',
            estado: 'pendiente',
            creadoEn: new Date().toISOString(),
        });
    } catch (err) {
        console.error('submit-reserva Firestore error:', err);
        return Response.json({ error: 'Error al guardar la reserva' }, { status: 500 });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });

        const safeMensaje = (mensaje || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        await transporter.sendMail({
            from: `"Cal Silvino" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Tu reserva en Cal Silvino está siendo revisada',
            html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#1a0a0a;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#c50101;padding:30px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Cal Silvino</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Restaurante · La Massana, Andorra</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h2 style="color:#fff;margin:0 0 12px;">Hola, ${nombre} 👋</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Hemos recibido tu solicitud de reserva y la estamos revisando. En breve te confirmaremos.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Detalles de tu reserva</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>Fecha:</strong> ${fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🌐 <strong>Turno:</strong> ${turno}${hora ? ` · ${hora}` : ''}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>Personas:</strong> ${personas}</td></tr>
            ${safeMensaje ? `<tr><td style="padding:4px 0;color:#fff;font-size:14px;">💬 <strong>Comentarios:</strong> ${safeMensaje}</td></tr>` : ''}
          </table>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 8px;">Te confirmaremos en <strong>menos de 24 horas</strong>.</p>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;">¿No recibes respuesta? Llámanos al <a href="tel:+376840720" style="color:#c50101;text-decoration:none;">+376 840 720</a></p>
        </td></tr>
        <tr><td style="background:rgba(255,255,255,0.04);padding:16px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">Av. el Través, 21 · AD400 La Massana, Andorra</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });
    } catch (err) {
        console.error('submit-reserva email error:', err);
        // La reserva ya se guardó en Firestore, no fallar por el email
    }

    return Response.json({ success: true, id: docRef.id });
};
