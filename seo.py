"""
SEO script para Cal Silvino
Ejecutar: python seo.py

Genera / actualiza:
  1. sitemap.xml
  2. robots.txt
  3. JSON-LD (Schema.org Restaurant) inyectado en cada página HTML
  4. Informe de auditoría SEO (seo_report.txt)
"""

import os
import re
from datetime import date
from html.parser import HTMLParser

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
BASE_URL    = "https://restaurantcalsilvino.com"
SITE_DIR    = os.path.dirname(os.path.abspath(__file__))
HTML_FILES  = ["index.html", "menu.html", "contacto.html"]

RESTAURANT_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Cal Silvino",
    "url": BASE_URL,
    "telephone": "+376840720",
    "email": "info@restaurantcalsilvino.com",
    "image": f"{BASE_URL}/images/fondo.png",
    "logo": f"{BASE_URL}/images/logo.png",
    "description": "Restaurante familiar en La Massana, Andorra. Cocina tradicional andorrana y mediterránea.",
    "priceRange": "€€",
    "servesCuisine": ["Andorrana", "Mediterránea"],
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. el Través, 21",
        "addressLocality": "La Massana",
        "postalCode": "AD400",
        "addressCountry": "AD"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 42.5458333,
        "longitude": 1.5172222
    },
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday"],
            "opens": "13:00",
            "closes": "16:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Wednesday", "Thursday", "Friday"],
            "opens": "13:00",
            "closes": "16:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Wednesday", "Thursday", "Friday"],
            "opens": "20:00",
            "closes": "23:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday"],
            "opens": "13:00",
            "closes": "16:30"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday"],
            "opens": "20:00",
            "closes": "23:30"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday"],
            "opens": "13:00",
            "closes": "16:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday"],
            "opens": "20:00",
            "closes": "23:00"
        }
    ],
    "sameAs": [
        "https://www.instagram.com/calsilvino/",
        "https://www.facebook.com/calsilvino/"
    ]
}

# Prioridades y frecuencias de cambio por página
PAGE_META = {
    "index.html":    {"priority": "1.0", "changefreq": "weekly"},
    "menu.html":     {"priority": "0.9", "changefreq": "monthly"},
    "contacto.html": {"priority": "0.8", "changefreq": "monthly"},
}

# ─── UTILIDADES ───────────────────────────────────────────────────────────────

class SEOParser(HTMLParser):
    """Extrae etiquetas relevantes de un archivo HTML para la auditoría."""
    def __init__(self):
        super().__init__()
        self.title        = None
        self.description  = None
        self.canonical    = None
        self.og_title     = None
        self.og_desc      = None
        self.h1_count     = 0
        self.img_missing_alt = []
        self.has_schema   = False
        self._in_title    = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta":
            name    = attrs.get("name", "").lower()
            prop    = attrs.get("property", "").lower()
            content = attrs.get("content", "")
            if name == "description":
                self.description = content
            elif prop == "og:title":
                self.og_title = content
            elif prop == "og:description":
                self.og_desc = content
        elif tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "img":
            alt = attrs.get("alt", "").strip()
            src = attrs.get("src", "")
            if not alt:
                self.img_missing_alt.append(src)
        elif tag == "script" and attrs.get("type") == "application/ld+json":
            self.has_schema = True

    def handle_data(self, data):
        if self._in_title:
            self.title = data.strip()
            self._in_title = False


def read_file(path):
    with open(path, encoding="utf-8") as f:
        return f.read()

def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {os.path.relpath(path, SITE_DIR)}")


# ─── 1. SITEMAP.XML ───────────────────────────────────────────────────────────

def generate_sitemap():
    print("\n[1/4] Generando sitemap.xml...")
    today = date.today().isoformat()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    for page, meta in PAGE_META.items():
        url = f"{BASE_URL}/{page}" if page != "index.html" else BASE_URL + "/"
        lines += [
            "  <url>",
            f"    <loc>{url}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f"    <changefreq>{meta['changefreq']}</changefreq>",
            f"    <priority>{meta['priority']}</priority>",
            "  </url>",
        ]

    lines.append("</urlset>")
    write_file(os.path.join(SITE_DIR, "sitemap.xml"), "\n".join(lines))


# ─── 2. ROBOTS.TXT ────────────────────────────────────────────────────────────

def generate_robots():
    print("\n[2/4] Generando robots.txt...")
    content = f"""User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /.netlify/

Sitemap: {BASE_URL}/sitemap.xml
"""
    write_file(os.path.join(SITE_DIR, "robots.txt"), content)


# ─── 3. INYECTAR JSON-LD ──────────────────────────────────────────────────────

def inject_schema():
    import json
    print("\n[3/4] Inyectando JSON-LD Schema.org en páginas HTML...")
    schema_block = (
        '\n  <script type="application/ld+json">\n'
        + json.dumps(RESTAURANT_SCHEMA, ensure_ascii=False, indent=2)
        + '\n  </script>'
    )

    for page in HTML_FILES:
        path = os.path.join(SITE_DIR, page)
        if not os.path.exists(path):
            print(f"  ⚠ No encontrado: {page}")
            continue

        html = read_file(path)

        # Eliminar bloque JSON-LD existente si lo hay
        html = re.sub(
            r'\s*<script type="application/ld\+json">.*?</script>',
            '',
            html,
            flags=re.DOTALL
        )

        # Insertar justo antes de </head>
        if "</head>" in html:
            html = html.replace("</head>", schema_block + "\n</head>", 1)
            write_file(path, html)
        else:
            print(f"  ⚠ No se encontró </head> en {page}")


# ─── 4. AUDITORÍA SEO ─────────────────────────────────────────────────────────

def audit_seo():
    print("\n[4/4] Generando informe de auditoría SEO...")
    report = [
        "=" * 60,
        "  INFORME SEO — Cal Silvino",
        f"  Generado: {date.today().isoformat()}",
        "=" * 60,
    ]

    for page in HTML_FILES:
        path = os.path.join(SITE_DIR, page)
        if not os.path.exists(path):
            continue

        parser = SEOParser()
        parser.feed(read_file(path))

        issues   = []
        warnings = []
        ok       = []

        # Title
        if not parser.title:
            issues.append("❌ Falta <title>")
        elif len(parser.title) > 60:
            warnings.append(f"⚠  <title> muy largo ({len(parser.title)} chars, máx 60): \"{parser.title[:55]}...\"")
        else:
            ok.append(f"✓  <title> ({len(parser.title)} chars)")

        # Meta description
        if not parser.description:
            issues.append("❌ Falta meta description")
        elif len(parser.description) > 160:
            warnings.append(f"⚠  Meta description muy larga ({len(parser.description)} chars, máx 160)")
        else:
            ok.append(f"✓  Meta description ({len(parser.description)} chars)")

        # Canonical
        if not parser.canonical:
            warnings.append("⚠  Falta etiqueta canonical")
        else:
            ok.append(f"✓  Canonical: {parser.canonical}")

        # OG tags
        if not parser.og_title:
            warnings.append("⚠  Falta og:title")
        else:
            ok.append("✓  og:title presente")

        if not parser.og_desc:
            warnings.append("⚠  Falta og:description")
        else:
            ok.append("✓  og:description presente")

        # H1
        if parser.h1_count == 0:
            issues.append("❌ No hay ningún <h1>")
        elif parser.h1_count > 1:
            warnings.append(f"⚠  Hay {parser.h1_count} etiquetas <h1> (debería haber solo 1)")
        else:
            ok.append("✓  Un solo <h1>")

        # Imágenes sin alt
        if parser.img_missing_alt:
            for src in parser.img_missing_alt:
                warnings.append(f"⚠  Imagen sin alt: {src}")
        else:
            ok.append("✓  Todas las imágenes tienen atributo alt")

        # Schema
        if parser.has_schema:
            ok.append("✓  JSON-LD Schema.org presente")
        else:
            warnings.append("⚠  Falta JSON-LD Schema.org")

        # Escribir sección
        report.append(f"\n── {page} " + "─" * (50 - len(page)))
        report += ok
        report += warnings
        report += issues
        if not issues and not warnings:
            report.append("🎉 Sin problemas detectados")

    report += [
        "\n" + "=" * 60,
        "  Archivos generados/actualizados:",
        "  • sitemap.xml",
        "  • robots.txt",
        "  • JSON-LD inyectado en index.html, menu.html, contacto.html",
        "=" * 60,
    ]

    report_path = os.path.join(SITE_DIR, "seo_report.txt")
    write_file(report_path, "\n".join(report))

    # Mostrar también en consola
    print("\n" + "\n".join(report))


# ─── MAIN ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("🔍 SEO Script — Cal Silvino")
    generate_sitemap()
    generate_robots()
    inject_schema()
    audit_seo()
    print("\n✅ Hecho. Revisa seo_report.txt para el resumen completo.")
