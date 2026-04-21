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

    const contentType = req.headers.get('content-type') || '';

    let name, pdfBuffer;

    try {
        if (contentType.includes('multipart/form-data')) {
            // Modern path: FormData (no base64 overhead)
            const formData = await req.formData();
            name = formData.get('name');
            const file = formData.get('pdf');
            if (!file || typeof file === 'string') {
                return Response.json({ error: 'Archivo PDF no recibido' }, { status: 400 });
            }
            const arrayBuffer = await file.arrayBuffer();
            pdfBuffer = Buffer.from(arrayBuffer);
        } else {
            // Legacy path: JSON base64
            const body = await req.json();
            name = body.name;
            pdfBuffer = Buffer.from(body.data, 'base64');
        }
    } catch {
        return Response.json({ error: 'Petición inválida' }, { status: 400 });
    }

    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    if (!pdfBuffer || pdfBuffer.length === 0 || pdfBuffer.length > MAX_SIZE_BYTES) {
        return Response.json(
            { error: `El archivo debe tener entre 1 byte y 5 MB` },
            { status: 400 }
        );
    }

    const store = getStore({ name: 'pdfs', consistency: 'strong' });
    await store.set(name, pdfBuffer, {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });

    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
};
