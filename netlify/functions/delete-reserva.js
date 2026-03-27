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
