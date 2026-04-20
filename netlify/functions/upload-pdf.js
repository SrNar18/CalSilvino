import { getStore } from '@netlify/blobs';
import { validateToken } from './lib/utils.js';

const ALLOWED       = ['carta-es-ca', 'carta-fr-en', 'menu-dia'];
const MAX_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const auth  = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return Response.json({ error: 'No autorizado. Inicia sesión de nuevo.' }, { status: 401 });
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    const { name, data } = body;

    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    let pdfBuffer;
    try {
        pdfBuffer = Buffer.from(data, 'base64');
    } catch {
        return Response.json({ error: 'Datos de archivo inválidos' }, { status: 400 });
    }

    if (pdfBuffer.length === 0 || pdfBuffer.length > MAX_SIZE_BYTES) {
        return Response.json(
            { error: `El archivo debe tener entre 1 byte y ${MAX_SIZE_BYTES / 1024 / 1024} MB` },
            { status: 400 }
        );
    }

    const store = getStore({ name: 'pdfs', consistency: 'strong' });
    await store.set(name, pdfBuffer, {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });

    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
};
