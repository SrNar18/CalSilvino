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