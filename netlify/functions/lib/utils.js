import crypto from 'node:crypto';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function validateToken(token) {
    const secret = process.env.ADMIN_SECRET || '';
    if (!token || !secret) return false;
    try {
        const [payloadB64, sig] = token.split('.');
        if (!payloadB64 || !sig) return false;
        const payload   = Buffer.from(payloadB64, 'base64').toString();
        const timestamp = parseInt(payload, 10);
        if (isNaN(timestamp)) return false;
        if (Date.now() - timestamp > 4 * 60 * 60 * 1000) return false; // 4 horas
        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
        if (sig.length !== expected.length) return false;
        return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    } catch { return false; }
}

export function initFirebase() {
    if (getApps().length === 0) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({ credential: cert(serviceAccount) });
    }
    return getFirestore();
}
