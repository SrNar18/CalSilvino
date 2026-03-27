import nodemailer from 'nodemailer';
import { validateToken, initFirebase } from './lib/utils.js';

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const auth  = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    const { id, estado } = body;

    if (!id || !['aceptada', 'rechazada'].includes(estado)) {
        return Response.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    try {
        const db     = initFirebase();
        const docRef = db.collection('reservaciones').doc(id);
        const doc    = await docRef.get();

        if (!doc.exists) {
            return Response.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        const reserva = doc.data();
        await docRef.update({ estado, actualizadoEn: new Date().toISOString() });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });

        const isAceptada = estado === 'aceptada';

        await transporter.sendMail({
            from: `"Cal Silvino" <${process.env.GMAIL_USER}>`,
            to: reserva.email,
            subject: isAceptada
                ? '✅ Tu reserva en Cal Silvino ha sido confirmada'
                : 'Sobre tu reserva en Cal Silvino',
            html: isAceptada ? `
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
          <h2 style="color:#4ade80;margin:0 0 12px;">✅ ¡Reserva confirmada!</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Hola <strong style="color:#fff;">${reserva.nombre}</strong>, nos complace confirmar tu reserva. ¡Te esperamos con los brazos abiertos!</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Tu reserva confirmada</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>Fecha:</strong> ${reserva.fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🕐 <strong>Hora:</strong> ${reserva.hora}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>Personas:</strong> ${reserva.personas}</td></tr>
          </table>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;">Si necesitas cambiar algo, llámanos al <a href="tel:+376840720" style="color:#c50101;text-decoration:none;">+376 840 720</a></p>
        </td></tr>
        <tr><td style="background:rgba(255,255,255,0.04);padding:16px;text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.3);font-size:12px;">Av. el Través, 21 · AD400 La Massana, Andorra</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>` : `
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
          <h2 style="color:#f87171;margin:0 0 12px;">Lo sentimos</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Hola <strong style="color:#fff;">${reserva.nombre}</strong>, lamentablemente no podemos confirmar tu reserva para la fecha solicitada.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Reserva solicitada</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>Fecha:</strong> ${reserva.fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🕐 <strong>Hora:</strong> ${reserva.hora}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>Personas:</strong> ${reserva.personas}</td></tr>
          </table>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Te invitamos a contactarnos para encontrar una fecha alternativa.</p>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;">📞 <a href="tel:+376840720" style="color:#c50101;text-decoration:none;">+376 840 720</a></p>
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

        return Response.json({ success: true });
    } catch (err) {
        console.error('update-reserva error:', err);
        return Response.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }
};
