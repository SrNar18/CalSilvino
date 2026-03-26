// ── Admin Auth Function ──
// Valida las credenciales contra las variables de entorno de Netlify.
// Variables requeridas en el dashboard de Netlify:
//   ADMIN_USERNAME  →  el nombre de usuario del admin
//   ADMIN_PASSWORD  →  la contraseña del admin
//   ADMIN_SECRET    →  cadena aleatoria larga para firmar tokens (ej: openssl rand -hex 32)

const crypto = require('crypto');

function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method not allowed' };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Petición inválida' }) };
    }

    const { username, password } = body;
    const expectedUser = process.env.ADMIN_USERNAME || '';
    const expectedPass = process.env.ADMIN_PASSWORD || '';
    const secret      = process.env.ADMIN_SECRET    || '';

    if (!expectedUser || !expectedPass || !secret) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Servidor no configurado. Añade ADMIN_USERNAME, ADMIN_PASSWORD y ADMIN_SECRET en las variables de entorno de Netlify.' })
        };
    }

    const valid = safeEqual(String(username || ''), expectedUser)
               && safeEqual(String(password || ''), expectedPass);

    if (!valid) {
        // Pequeño delay para dificultar ataques de fuerza bruta
        await new Promise(r => setTimeout(r, 800));
        return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Usuario o contraseña incorrectos' })
        };
    }

    // Token = base64(timestamp) + "." + HMAC-SHA256
    const payload = Date.now().toString();
    const sig     = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const token   = Buffer.from(payload).toString('base64') + '.' + sig;

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    };
};
