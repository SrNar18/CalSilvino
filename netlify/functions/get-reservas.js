import crypto from 'node:crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function validateToken(token) {
    const secret = process.env.ADMIN_SECRET || '';
    if (!token || !secret) return false;
    try {
        const [payloadB64, sig] = token.split('.');
        if (!payloadB64 || !sig) return false;
        const payload   = Buffer.from(payloadB64, 'base64').toString();
        const timestamp = parseInt(payload, 10);
        if (isNaN(timestamp)) return false;
        if (Date.now() - timestamp > 4 * 60 * 60 * 1000) return false;
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        if (sig.length !== expected.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { return false; }
}

function initFirebase() {
    if (getApps().length === 0) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({ credential: cert(serviceAccount) });
    }
    return getFirestore();
}

export default async (req) => {
    if (req.method !== 'GET') {
        return new Response('Method not allowed', { status: 405 });
    }

    const auth  = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return Response.json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const db       = initFirebase();
        const snapshot = await db.collection('reservaciones').orderBy('creadoEn', 'desc').get();
        const reservas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return Response.json({ reservas });
    } catch (err) {
        console.error('get-reservas error:', err);
        return Response.json({ error: 'Error al obtener reservas' }, { status: 500 });
    }
};
