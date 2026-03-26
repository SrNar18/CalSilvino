// ── Serve PDF Function ──
// Sirve el PDF desde Netlify Blobs si el admin ha subido uno.
// Si no hay versión subida, redirige al PDF estático en /pdfs/.
// URL: /.netlify/functions/serve-pdf?name=carta-es-ca

const ALLOWED = ['carta-es-ca', 'carta-fr-en'];

exports.handler = async (event) => {
    const name = (event.queryStringParameters || {}).name || '';

    if (!ALLOWED.includes(name)) {
        return { statusCode: 400, body: 'Nombre de PDF no válido' };
    }

    try {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({ name: 'pdfs', consistency: 'strong' });
        const blob  = await store.get(name, { type: 'arrayBuffer' });

        if (blob && blob.byteLength > 0) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `inline; filename="${name}.pdf"`,
                    'Cache-Control': 'public, max-age=3600'
                },
                body: Buffer.from(blob).toString('base64'),
                isBase64Encoded: true
            };
        }
    } catch {
        // Blob no disponible — caer en el estático
    }

    // Fallback: redirige al PDF estático del repositorio
    return {
        statusCode: 302,
        headers: { Location: `/pdfs/${name}.pdf` }
    };
};
