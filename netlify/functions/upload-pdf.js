// ── Upload PDF Function ──
// Recibe el PDF en base64, valida el token de sesión y lo guarda en Netlify Blobs.
// El nombre del PDF debe ser 'carta-es-ca' o 'carta-fr-en'.

const crypto = require('crypto');

const ALLOWED = ['carta-es-ca', 'carta-fr-en'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function validateToken(token) {
    const secret = process.env.ADMIN_SECRET || '';
    if (!token || !secret) return false;
    try {
        const [payloadB64, sig] = token.split('.');
        if (!payloadB64 || !sig) return false;
        const payload   = Buffer.from(payloadB64, 'base64').toString();
        const timestamp = parseInt(payload, 10);
        if (isNaN(timestamp)) return false;
        // Token válido por 4 horas
        if (Date.now() - timestamp > 4 * 60 * 60 * 1000) return false;
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        if (sig.length !== expected.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { return false; }
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    const auth  = event.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'No autorizado. Inicia sesión de nuevo.' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Petición inválida' }) };
    }

    const { name, data } = body;

    if (!ALLOWED.includes(name)) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Nombre de archivo no permitido' })
        };
    }

    let pdfBuffer;
    try {
        pdfBuffer = Buffer.from(data, 'base64');
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Datos de archivo inválidos' }) };
    }

    if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_SIZE_BYTES) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `El archivo debe tener entre 1 byte y ${MAX_SIZE_BYTES / 1024 / 1024} MB` })
        };
    }

    const { getStore } = await import('@netlify/blobs');
    const store = getStore('pdfs');
    await store.set(name, pdfBuffer, {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'PDF subido y actualizado correctamente.' })
    };
};
