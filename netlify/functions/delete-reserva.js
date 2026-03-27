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

    const { id } = body;

    if (!id) {
        return Response.json({ error: 'ID requerido' }, { status: 400 });
    }

    try {
        const db = initFirebase();
        await db.collection('reservaciones').doc(id).delete();
        return Response.json({ success: true });
    } catch (err) {
        console.error('delete-reserva error:', err);
        return Response.json({ error: 'Error al eliminar la reserva' }, { status: 500 });
    }
};
