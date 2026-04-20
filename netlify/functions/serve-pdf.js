const ALLOWED = ['carta-es-ca', 'carta-fr-en', 'menu-dia'];

export default async (req) => {
    const url = new URL(req.url);
    const name = url.searchParams.get('name') || '';

    if (!ALLOWED.includes(name)) {
        return new Response('Nombre de PDF no válido', { status: 400 });
    }

    try {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({ name: 'pdfs', consistency: 'strong' });
        const blob = await store.get(name, { type: 'arrayBuffer' });

        if (blob && blob.byteLength > 0) {
            return new Response(Buffer.from(blob), {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `inline; filename="${name}.pdf"`,
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }
    } catch {}

    return Response.redirect(new URL(`/pdfs/${name}.pdf`, req.url), 302);
};