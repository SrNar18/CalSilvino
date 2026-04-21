import { getStore } from '@netlify/blobs';
import { validateToken } from './lib/utils.js';

const ALLOWED        = ['carta-es-ca', 'carta-fr-en', 'menu-dia'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export default async (req) => {
    // Top-level catch — always return JSON, never a plain-text 500
    try {
        if (req.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        const auth  = req.headers.get('authorization') || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

        if (!validateToken(token)) {
            return Response.json({ error: 'No autorizado. Inicia sesión de nuevo.' }, { status: 401 });
        }

        // Get name from header or query string (safe URL parse with fallback base)
        let name = req.headers.get('x-pdf-name') || '';
        if (!name) {
            try {
                const url = new URL(req.url, 'http://localhost');
                name = url.searchParams.get('name') || '';
            } catch {
                name = '';
            }
        }

        if (!ALLOWED.includes(name)) {
            return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
        }

        // Read body as raw bytes
        let pdfBuffer;
        const arrayBuffer = await req.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            return Response.json({ error: 'El archivo está vacío' }, { status: 400 });
        }

        if (pdfBuffer.length > MAX_SIZE_BYTES) {
            return Response.json({ error: 'El archivo supera los 5 MB' }, { status: 400 });
        }

        const store = getStore({ name: 'pdfs', consistency: 'strong' });
        await store.set(name, pdfBuffer, {
            metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
        });

        return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });

    } catch (err) {
        return Response.json({ error: 'Error interno: ' + (err.message || String(err)) }, { status: 500 });
    }
};
