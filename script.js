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
                window.location.href = "reserva.html";
            });
        }
    });

    // BOTÓN DEL BANNER (Reservar ahora)
    const bannerBtn = document.querySelector(".home-banner-button");
    if (bannerBtn) {
        bannerBtn.addEventListener("click", () => {
            window.location.href = "reserva.html";
        });
    }

    // LOGO → recarga + index
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

});

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






const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-img");
const nextBtn = document.querySelector(".carousel-btn.next");
const prevBtn = document.querySelector(".carousel-btn.prev");

let index = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
}

// BOTONES
nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateCarousel();
});

prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateCarousel();
});

// AUTOMÁTICO
setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
}, 4000); // cada 4 segundos