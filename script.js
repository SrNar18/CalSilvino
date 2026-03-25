// ── MODAL PDF ──
function openPdfModal(pdfPath, title) {
    const modal       = document.getElementById("pdfModal");
    const frame       = document.getElementById("pdfFrame");
    const downloadBtn = document.getElementById("pdfDownloadBtn");
    const titleEl     = document.getElementById("pdfModalTitle");
    const fallback    = document.getElementById("pdfFallback");
    const fallbackLink = document.getElementById("pdfFallbackLink");

    titleEl.textContent = title;
    downloadBtn.href     = pdfPath;
    downloadBtn.setAttribute("download", pdfPath.split("/").pop());

    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
        frame.style.display    = "none";
        fallback.style.display = "flex";
        fallbackLink.href = pdfPath;
        fallbackLink.setAttribute("download", pdfPath.split("/").pop());
        frame.src = "";
    } else {
        frame.style.display    = "block";
        fallback.style.display = "none";
        frame.src = pdfPath;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePdfModal() {
    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Pequeño delay para que la animación termine antes de vaciar el iframe
    setTimeout(() => { frame.src = ""; }, 250);
}

function handleModalOverlayClick(e) {
    if (e.target === document.getElementById("pdfModal")) {
        closePdfModal();
    }
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePdfModal();
});

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

    // HAMBURGER MENU
    const hamburger = document.getElementById("hamburger");
    const mainNav   = document.getElementById("mainNav");

    if (hamburger && mainNav) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("open");
            mainNav.classList.toggle("open");
            document.body.style.overflow = mainNav.classList.contains("open") ? "hidden" : "";
        });
    }

    function closeNav() {
        if (hamburger && mainNav) {
            hamburger.classList.remove("open");
            mainNav.classList.remove("open");
            document.body.style.overflow = "";
        }
    }

    // LINKS DEL NAV
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();

        if (text === "inicio") {
            link.addEventListener("click", () => {
                closeNav();
                window.location.href = "index.html";
            });
        }

        if (text === "menú" || text === "menu") {
            link.addEventListener("click", () => {
                closeNav();
                window.location.href = "menu.html";
            });
        }

        if (text === "contacto") {
            link.addEventListener("click", () => {
                closeNav();
                window.location.href = "contacto.html";
            });
        }

        if (link.classList.contains("nav-reservar-mobile")) {
            link.addEventListener("click", () => {
                closeNav();
                window.location.href = "contacto.html";
            });
        }
    });

    // BOTÓN NAV (Reservar ahora) — versión desktop
    const navBtn = document.querySelector(".nav-btn");
    if (navBtn) {
        navBtn.addEventListener("click", () => {
            window.location.href = "contacto.html";
        });
    }

    // BOTÓN DEL BANNER (Reservar mesa)
    const bannerBtn = document.querySelector(".home-banner-button");
    if (bannerBtn) {
        bannerBtn.addEventListener("click", () => {
            window.location.href = "contacto.html";
        });
    }

    // BOTÓN VER MENÚ
    const menuBtn = document.querySelector(".home-menu-button");
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            window.location.href = "menu.html";
        });
    }

    // BOTÓN CTA RESERVA (menú)
    const ctaBtn = document.querySelector(".menu-cta-btn");
    if (ctaBtn) {
        ctaBtn.addEventListener("click", () => {
            window.location.href = "contacto.html";
        });
    }

    // LOGO → index
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // FORMULARIO DE RESERVA
    const form = document.getElementById("reservaForm");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(form);

            fetch(form.action, {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    alert("Tu reserva se ha enviado correctamente ✅");
                    form.reset();
                } else {
                    alert("Error al enviar la reserva ❌");
                }
            })
            .catch(() => {
                alert("Error de conexión ❌");
            });
        });
    }

    // CARRUSEL HOME (manual con botones)
    const track = document.querySelector(".about-carousel-track");
    const slides = document.querySelectorAll(".about-carousel-img");
    const nextBtn = document.querySelector(".carousel-btn.next");
    const prevBtn = document.querySelector(".carousel-btn.prev");

    if (track && slides.length > 0 && nextBtn && prevBtn) {
        let index = 0;
        const dots = document.querySelectorAll(".dot");

        function updateCarousel() {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        }

        nextBtn.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                index = i;
                updateCarousel();
            });
        });

        setInterval(() => {
            index = (index + 1) % slides.length;
            updateCarousel();
        }, 4000);
    }

    // BOTÓN TELÉFONO
    const phoneBtn = document.getElementById("phoneBtn");
    if (phoneBtn) {
        phoneBtn.addEventListener("click", function(e) {
            e.preventDefault();

            const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);

            if (isMobile) {
                window.location.href = "tel:+376840720";
            } else {
                alert("Utiliza tu teléfono móvil para llamar 📞\n\nNúmero: +376 840 720");
            }
        });
    }

});