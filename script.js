// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

    // LINKS DEL NAV
    const links = document.querySelectorAll("nav a");

    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();

        if (text === "inicio") {
            link.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }

        if (text === "menú" || text === "menu") {
            link.addEventListener("click", () => {
                window.location.href = "menu.html";
            });
        }

        if (text === "contacto") {
            link.addEventListener("click", () => {
                window.location.href = "contacto.html";
            });
        }

        if (link.classList.contains("btn")) {
            link.addEventListener("click", () => {
                window.location.href = "contacto.html";
            });
        }
    });

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

        function updateCarousel() {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        nextBtn.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            updateCarousel();
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