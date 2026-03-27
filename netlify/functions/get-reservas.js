import { validateToken, initFirebase } from './lib/utils.js';

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
