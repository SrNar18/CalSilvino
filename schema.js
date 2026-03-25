// ══════════════════════════════════════════
//  CAL SILVINO — Schema.org JSON-LD
//  Datos estructurados para SEO local
// ══════════════════════════════════════════
(function () {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        "name": "Cal Silvino",
        "description": "Restaurante familiar de cocina tradicional andorrana y mediterránea en La Massana, Andorra. Especialidad en bacalao a la llauna, pulpo a la brasa, carnes y platos de temporada.",
        "url": "https://restaurantcalsilvino.com",
        "telephone": "+376840720",
        "email": "info@restaurantcalsilvino.com",
        "image": "https://restaurantcalsilvino.com/images/fondo.png",
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
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Wednesday", "Thursday", "Friday"], "opens": "10:00", "closes": "16:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Wednesday", "Thursday", "Friday"], "opens": "20:00", "closes": "23:00" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday", "Sunday"], "opens": "11:00", "closes": "16:30" },
            { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday", "Sunday"], "opens": "20:00", "closes": "23:30" }
        ],
        "servesCuisine": ["Andorrana", "Mediterránea", "Portuguesa", "Catalana"],
        "priceRange": "€€",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "200"
        },
        "menu": "https://restaurantcalsilvino.com/menu.html",
        "hasMap": "https://www.google.com/maps?q=42.5458333,1.5172222",
        "sameAs": [
            "https://www.instagram.com/calsilvino/",
            "https://www.facebook.com/calsilvino/"
        ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
})();
