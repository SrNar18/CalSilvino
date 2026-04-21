import { getStore } from '@netlify/blobs';
import { validateToken } from './lib/utils.js';

const ALLOWED          = ['carta-es-ca', 'carta-fr-en', 'menu-dia'];
const MAX_TOTAL_BYTES  = 10 * 1024 * 1024; // 10 MB final file limit
const MAX_CHUNK_BYTES  =  3 * 1024 * 1024; // 3 MB per chunk → ~4 MB base64, safely under Lambda's 6 MB

export default async (req) => {
    try {
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

        const { action = 'single' } = body;

        if (action === 'chunk')    return await handleChunk(body);
        if (action === 'finalize') return await handleFinalize(body);
        return await handleSingle(body);

    } catch (err) {
        return Response.json({ error: 'Error interno: ' + (err?.message || String(err)) }, { status: 500 });
    }
};

// ── Single upload (files ≤ 3 MB) ────────────────────────────────────────────
async function handleSingle({ name, data }) {
    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }
    const buf = Buffer.from(data, 'base64');
    if (!buf.length) return Response.json({ error: 'Archivo vacío' }, { status: 400 });
    if (buf.length > MAX_TOTAL_BYTES) return Response.json({ error: 'El archivo supera los 10 MB' }, { status: 400 });

    const store = getStore({ name: 'pdfs', consistency: 'strong' });
    await store.set(name, buf, {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });
    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
}

// ── Upload one chunk ─────────────────────────────────────────────────────────
async function handleChunk({ uploadId, chunkIndex, totalChunks, name, data }) {
    if (!uploadId || chunkIndex == null || !totalChunks || !name || !data) {
        return Response.json({ error: 'Datos de chunk incompletos' }, { status: 400 });
    }
    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    const buf = Buffer.from(data, 'base64');
    if (buf.length > MAX_CHUNK_BYTES) {
        return Response.json({ error: 'Chunk demasiado grande' }, { status: 400 });
    }

    const store = getStore({ name: 'pdfs', consistency: 'strong' });
    await store.set(`tmp-${uploadId}-${chunkIndex}`, buf);

    return Response.json({ success: true, chunkIndex });
}

// ── Finalize: assemble all chunks into the final PDF ─────────────────────────
async function handleFinalize({ uploadId, name, totalChunks }) {
    if (!uploadId || !name || !totalChunks) {
        return Response.json({ error: 'Datos de finalización incompletos' }, { status: 400 });
    }
    if (!ALLOWED.includes(name)) {
        return Response.json({ error: 'Nombre de archivo no permitido' }, { status: 400 });
    }

    const store  = getStore({ name: 'pdfs', consistency: 'strong' });
    const chunks = [];
    let   total  = 0;

    for (let i = 0; i < totalChunks; i++) {
        const ab = await store.get(`tmp-${uploadId}-${i}`, { type: 'arrayBuffer' });
        if (!ab) {
            return Response.json({ error: `Chunk ${i} no encontrado. Reinicia la subida.` }, { status: 400 });
        }
        const buf = Buffer.from(ab);
        total += buf.length;
        if (total > MAX_TOTAL_BYTES) {
            await cleanChunks(store, uploadId, totalChunks);
            return Response.json({ error: 'El archivo supera los 10 MB' }, { status: 400 });
        }
        chunks.push(buf);
    }

    await store.set(name, Buffer.concat(chunks), {
        metadata: { contentType: 'application/pdf', uploadedAt: new Date().toISOString() }
    });

    // Clean temp chunks (best-effort)
    await cleanChunks(store, uploadId, totalChunks);

    return Response.json({ success: true, message: 'PDF subido y actualizado correctamente.' });
}

async function cleanChunks(store, uploadId, totalChunks) {
    await Promise.all(
        Array.from({ length: totalChunks }, (_, i) =>
            store.delete(`tmp-${uploadId}-${i}`).catch(() => {})
        )
    );
}
