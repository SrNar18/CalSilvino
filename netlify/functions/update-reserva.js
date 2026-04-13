import nodemailer from 'nodemailer';
import { validateToken, initFirebase } from './lib/utils.js';

const EMAIL_TEXTS = {
    es: {
        acceptSubject: '✅ Tu reserva en Cal Silvino ha sido confirmada',
        rejectSubject: 'Sobre tu reserva en Cal Silvino',
        acceptTitle: '✅ ¡Reserva confirmada!',
        rejectTitle: 'Lo sentimos',
        acceptIntro: 'nos complace confirmar tu reserva. ¡Te esperamos con los brazos abiertos!',
        rejectIntro: 'lamentablemente no podemos confirmar tu reserva para la fecha solicitada.',
        acceptDetails: 'Tu reserva confirmada',
        rejectDetails: 'Reserva solicitada',
        date: 'Fecha',
        time: 'Hora',
        people: 'Personas',
        changeNote: 'Si necesitas cambiar algo, llámanos al',
        rejectInvite: 'Te invitamos a contactarnos para encontrar una fecha alternativa.',
    },
    ca: {
        acceptSubject: '✅ La teva reserva a Cal Silvino ha estat confirmada',
        rejectSubject: 'Sobre la teva reserva a Cal Silvino',
        acceptTitle: '✅ Reserva confirmada!',
        rejectTitle: 'Ho sentim',
        acceptIntro: 'ens complau confirmar la teva reserva. T\'esperem amb els braços oberts!',
        rejectIntro: 'lamentablement no podem confirmar la teva reserva per a la data sol·licitada.',
        acceptDetails: 'La teva reserva confirmada',
        rejectDetails: 'Reserva sol·licitada',
        date: 'Data',
        time: 'Hora',
        people: 'Persones',
        changeNote: 'Si necessites canviar alguna cosa, truca\'ns al',
        rejectInvite: 'Et convidem a contactar-nos per trobar una data alternativa.',
    },
    pt: {
        acceptSubject: '✅ A sua reserva no Cal Silvino foi confirmada',
        rejectSubject: 'Sobre a sua reserva no Cal Silvino',
        acceptTitle: '✅ Reserva confirmada!',
        rejectTitle: 'Lamentamos',
        acceptIntro: 'temos o prazer de confirmar a sua reserva. Esperamos por si de braços abertos!',
        rejectIntro: 'lamentavelmente não podemos confirmar a sua reserva para a data solicitada.',
        acceptDetails: 'A sua reserva confirmada',
        rejectDetails: 'Reserva solicitada',
        date: 'Data',
        time: 'Hora',
        people: 'Pessoas',
        changeNote: 'Se precisar de alterar algo, ligue-nos para o',
        rejectInvite: 'Convidamo-lo a contactar-nos para encontrar uma data alternativa.',
    },
    en: {
        acceptSubject: '✅ Your reservation at Cal Silvino has been confirmed',
        rejectSubject: 'About your reservation at Cal Silvino',
        acceptTitle: '✅ Reservation confirmed!',
        rejectTitle: 'We\'re sorry',
        acceptIntro: 'we are pleased to confirm your reservation. We look forward to seeing you!',
        rejectIntro: 'unfortunately we cannot confirm your reservation for the requested date.',
        acceptDetails: 'Your confirmed reservation',
        rejectDetails: 'Requested reservation',
        date: 'Date',
        time: 'Time',
        people: 'Guests',
        changeNote: 'Need to change something? Call us at',
        rejectInvite: 'We invite you to contact us to find an alternative date.',
    },
};

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

    let db, reserva;
    try {
        db = initFirebase();
        const docRef = db.collection('reservaciones').doc(id);
        const doc    = await docRef.get();

        if (!doc.exists) {
            return Response.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        reserva = doc.data();
        await docRef.update({ estado, actualizadoEn: new Date().toISOString() });
    } catch (err) {
        console.error('update-reserva Firestore error:', err);
        return Response.json({ error: 'Error al actualizar la reserva' }, { status: 500 });
    }

    // Enviar email en el idioma del cliente — no bloquea la respuesta si falla
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
        });

        const userLang = ['es', 'ca', 'pt', 'en'].includes(reserva.lang) ? reserva.lang : 'es';
        const t = EMAIL_TEXTS[userLang];
        const isAceptada = estado === 'aceptada';

        await transporter.sendMail({
            from: `"Cal Silvino" <${process.env.GMAIL_USER}>`,
            to: reserva.email,
            subject: isAceptada ? t.acceptSubject : t.rejectSubject,
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
          <h2 style="color:#4ade80;margin:0 0 12px;">${t.acceptTitle}</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Hola <strong style="color:#fff;">${reserva.nombre}</strong>, ${t.acceptIntro}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(74,222,128,0.07);border:1px solid rgba(74,222,128,0.2);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">${t.acceptDetails}</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>${t.date}:</strong> ${reserva.fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🕐 <strong>${t.time}:</strong> ${reserva.hora}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>${t.people}:</strong> ${reserva.personas}</td></tr>
          </table>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;">${t.changeNote} <a href="tel:+376840720" style="color:#c50101;text-decoration:none;">+376 840 720</a></p>
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
          <h2 style="color:#f87171;margin:0 0 12px;">${t.rejectTitle}</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">Hola <strong style="color:#fff;">${reserva.nombre}</strong>, ${t.rejectIntro}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">${t.rejectDetails}</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>${t.date}:</strong> ${reserva.fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🕐 <strong>${t.time}:</strong> ${reserva.hora}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>${t.people}:</strong> ${reserva.personas}</td></tr>
          </table>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">${t.rejectInvite}</p>
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
    } catch (err) {
        console.error('update-reserva email error:', err);
    }

    return Response.json({ success: true });
};
