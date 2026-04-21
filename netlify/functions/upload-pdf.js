import { getStore } from '@netlify/blobs';
import { validateToken } from './lib/utils.js';

const ALLOWED        = ['carta-es-ca', 'carta-fr-en', 'menu-dia'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default async (req) => {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const auth  = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!validateToken(token)) {
        return Response.json({ error: 'No autorizado. Inicia sesión de nuevo.' }, { status: 401 });
    }

    // Name comes from query param or header
    const url  = new URL(req.url);
    const name = req.headers.get('x-pdf-name') || url.searchParams.get('name') || '';

    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    let pdfBuffer;
    try {
        const contentType = req.headers.get('content-type') || '';

        if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
            // Direct binary upload — most efficient, no encoding overhead
            const arrayBuffer = await req.arrayBuffer();
            pdfBuffer = Buffer.from(arrayBuffer);
        } else {
            // Legacy JSON base64 fallback
            const body = await req.json();
            pdfBuffer  = Buffer.from(body.data, 'base64');
        }
    } catch (err) {
        return Response.json({ error: 'No se pudo leer el archivo: ' + err.message }, { status: 400 });
    }

    if (!pdfBuffer || pdfBuffer.length === 0) {
        return Response.json({ error: 'El archivo está vacío' }, { status: 400 });
    }

    if (pdfBuffer.length > MAX_SIZE_BYTES) {
        return Response.json({ error: 'El archivo supera los 5 MB' }, { status: 400 });
    }

    try {
        const store = getStore({ name: 'pdfs', consistency: 'strong' });
        await store.set(name, pdfBuffer, {
            metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
        });
    } catch (err) {
        return Response.json({ error: 'Error al guardar el PDF: ' + err.message }, { status: 500 });
    }

    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
};
