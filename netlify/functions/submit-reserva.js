import nodemailer from 'nodemailer';
import { initFirebase } from './lib/utils.js';

const EMAIL_TEXTS = {
    es: {
        subject: 'Tu reserva en Cal Silvino está siendo revisada',
        greeting: 'Hola,',
        intro: 'Hemos recibido tu solicitud de reserva y la estamos revisando. En breve te confirmaremos.',
        detailsTitle: 'Detalles de tu reserva',
        date: 'Fecha',
        shift: 'Turno',
        people: 'Personas',
        comments: 'Comentarios',
        confirm: 'Te confirmaremos en <strong>menos de 24 horas</strong>.',
        noReply: '¿No recibes respuesta? Llámanos al',
    },
    ca: {
        subject: 'La teva reserva a Cal Silvino s\'està revisant',
        greeting: 'Hola,',
        intro: 'Hem rebut la teva sol·licitud de reserva i l\'estem revisant. En breu te la confirmarem.',
        detailsTitle: 'Detalls de la teva reserva',
        date: 'Data',
        shift: 'Torn',
        people: 'Persones',
        comments: 'Comentaris',
        confirm: 'Te la confirmarem en <strong>menys de 24 hores</strong>.',
        noReply: 'No reps resposta? Truca\'ns al',
    },
    pt: {
        subject: 'A sua reserva no Cal Silvino está a ser analisada',
        greeting: 'Olá,',
        intro: 'Recebemos o seu pedido de reserva e estamos a analisá-lo. Em breve confirmaremos.',
        detailsTitle: 'Detalhes da sua reserva',
        date: 'Data',
        shift: 'Turno',
        people: 'Pessoas',
        comments: 'Comentários',
        confirm: 'Confirmaremos em <strong>menos de 24 horas</strong>.',
        noReply: 'Não recebeu resposta? Ligue-nos para o',
    },
    en: {
        subject: 'Your reservation at Cal Silvino is being reviewed',
        greeting: 'Hello,',
        intro: 'We have received your reservation request and are reviewing it. We will confirm shortly.',
        detailsTitle: 'Your reservation details',
        date: 'Date',
        shift: 'Shift',
        people: 'Guests',
        comments: 'Comments',
        confirm: 'We will confirm within <strong>24 hours</strong>.',
        noReply: 'No reply? Call us at',
    },
};

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

    const { nombre, telefono, email, personas, fecha, turno, hora, mensaje, lang } = body;
    const userLang = ['es', 'ca', 'pt', 'en'].includes(lang) ? lang : 'es';

    if (!nombre || !telefono || !email || !personas || !fecha || !turno) {
        return Response.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

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
            lang: userLang,
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
        const t = EMAIL_TEXTS[userLang];

        await transporter.sendMail({
            from: `"Cal Silvino" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: t.subject,
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
          <h2 style="color:#fff;margin:0 0 12px;">${t.greeting} ${nombre} 👋</h2>
          <p style="color:rgba(255,255,255,0.7);line-height:1.6;">${t.intro}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.06);border-radius:10px;padding:20px;margin:24px 0;">
            <tr><td style="padding:0 0 12px;">
              <p style="margin:0;color:rgba(255,255,255,0.45);font-size:11px;text-transform:uppercase;letter-spacing:1px;">${t.detailsTitle}</p>
            </td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">📅 <strong>${t.date}:</strong> ${fecha}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">🌐 <strong>${t.shift}:</strong> ${turno}${hora ? ` · ${hora}` : ''}</td></tr>
            <tr><td style="padding:4px 0;color:#fff;font-size:14px;">👥 <strong>${t.people}:</strong> ${personas}</td></tr>
            ${safeMensaje ? `<tr><td style="padding:4px 0;color:#fff;font-size:14px;">💬 <strong>${t.comments}:</strong> ${safeMensaje}</td></tr>` : ''}
          </table>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0 0 8px;">${t.confirm}</p>
          <p style="color:rgba(255,255,255,0.45);font-size:13px;">${t.noReply} <a href="tel:+376840720" style="color:#c50101;text-decoration:none;">+376 840 720</a></p>
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
    }

    return Response.json({ success: true, id: docRef.id });
};
