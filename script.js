// ── MODAL PDF ──
function openPdfModal(pdfPath, title) {
    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");
    const downloadBtn = document.getElementById("pdfDownloadBtn");
    const titleEl = document.getElementById("pdfModalTitle");
    const fallback = document.getElementById("pdfFallback");
    const fallbackLink = document.getElementById("pdfFallbackLink");

    const freshPdfPath = `${pdfPath}${pdfPath.includes("?") ? "&" : "?"}v=${Date.now()}`;

    titleEl.textContent = title;
    downloadBtn.href = freshPdfPath;
    fallbackLink.href = freshPdfPath;

    const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

    if (isMobile) {
        frame.style.display = "none";
        fallback.style.display = "flex";
        frame.src = "";
    } else {
        frame.style.display = "block";
        fallback.style.display = "none";
        frame.src = freshPdfPath;
    }

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePdfModal() {
    const modal = document.getElementById("pdfModal");
    const frame = document.getElementById("pdfFrame");
    modal.classList.remove("active");
    document.body.style.overflow = "";
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

// ── REAL-TIME STATUS: Andorra holidays + schedule ──
(function() {
    // Meeus/Jones/Butcher algorithm for Easter Sunday
    function getEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31); // 1-based
        const day   = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    function addDays(date, n) {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    }

    function isAndorraHoliday(date) {
        const m = date.getMonth() + 1; // 1-based
        const d = date.getDate();
        const y = date.getFullYear();

        // Fixed holidays (month, day)
        const fixed = [
            [1,  1],  // New Year
            [1,  6],  // Epiphany
            [3, 14],  // Constitution Day
            [5,  1],  // Labour Day
            [8, 15],  // Assumption
            [9,  8],  // Meritxell
            [11, 1],  // All Saints
            [12, 8],  // Immaculate Conception
            [12, 25], // Christmas
            [12, 26], // Sant Esteve
        ];

        for (const [fm, fd] of fixed) {
            if (m === fm && d === fd) return true;
        }

        // Variable Easter-based holidays
        const easter = getEaster(y);
        const goodFriday    = addDays(easter, -2);
        const easterMonday  = addDays(easter,  1);
        const whitMonday    = addDays(easter, 50);

        const targets = [goodFriday, easterMonday, whitMonday];
        for (const t of targets) {
            if (t.getMonth() === date.getMonth() && t.getDate() === date.getDate()) return true;
        }

        return false;
    }

    function getAndorraNow() {
        const now = new Date();
        return new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Andorra' }));
    }

    function pad2(n) { return String(n).padStart(2, '0'); }

    function updateStatus() {
        const dotEl  = document.getElementById('statusDot');
        const textEl = document.getElementById('statusText');
        if (!dotEl || !textEl) return;

        const now     = getAndorraNow();
        const dow     = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const holiday = isAndorraHoliday(now);
        const hm      = now.getHours() * 60 + now.getMinutes();

        // Determine schedule type
        // Mon(1) or Tue(2) and NOT a holiday → closed all day
        const isClosedDay = (dow === 1 || dow === 2) && !holiday;
        // Weekend or holiday schedule: 11:00-16:30, 20:00-23:30
        const isWeekendSched = dow === 0 || dow === 6 || holiday;
        // Wed-Fri (not holiday override): 10:00-16:00, 20:00-23:00
        // (holiday overrides to weekend schedule even on weekdays)

        let openNow = false;
        let closesAt = null;  // "HH:MM"
        let nextOpenAt = null; // "HH:MM"
        let nextOpenTomorrow = false;

        if (isClosedDay) {
            // Closed all day — next open: Wed 10:00 (or check tomorrow if Tue→Wed)
            openNow = false;
            nextOpenAt = "10:00";
            nextOpenTomorrow = true;
        } else if (isWeekendSched) {
            // 11:00–16:30 and 20:00–23:30
            if (hm >= 660 && hm < 990) {
                // 11:00–16:30 open
                openNow = true;
                closesAt = "16:30";
            } else if (hm >= 1200 && hm < 1410) {
                // 20:00–23:30 open
                openNow = true;
                closesAt = "23:30";
            } else {
                openNow = false;
                if (hm < 660) {
                    nextOpenAt = "11:00";
                    nextOpenTomorrow = false;
                } else if (hm < 1200) {
                    nextOpenAt = "20:00";
                    nextOpenTomorrow = false;
                } else {
                    // after 23:30 — next day
                    nextOpenAt = "11:00";
                    nextOpenTomorrow = true;
                }
            }
        } else {
            // Wed–Fri: 10:00–16:00 and 20:00–23:00
            if (hm >= 600 && hm < 960) {
                // 10:00–16:00 open
                openNow = true;
                closesAt = "16:00";
            } else if (hm >= 1200 && hm < 1380) {
                // 20:00–23:00 open
                openNow = true;
                closesAt = "23:00";
            } else {
                openNow = false;
                if (hm < 600) {
                    nextOpenAt = "10:00";
                    nextOpenTomorrow = false;
                } else if (hm < 1200) {
                    nextOpenAt = "20:00";
                    nextOpenTomorrow = false;
                } else {
                    // after 23:00 — next day
                    nextOpenAt = "10:00";
                    nextOpenTomorrow = true;
                }
            }
        }

        const holidayPrefix = holiday ? "🎉 Festivo · " : "";

        dotEl.className = 'status-dot ' + (openNow ? 'open' : 'closed');

        if (openNow) {
            textEl.textContent = holidayPrefix + "Abierto · Cierra a las " + closesAt;
        } else {
            const whenStr = nextOpenTomorrow ? "Mañana · " : "";
            textEl.textContent = holidayPrefix + "Cerrado · Abre " + whenStr + "a las " + nextOpenAt;
        }
    }

    // Run once immediately and then every 60 seconds
    document.addEventListener('DOMContentLoaded', function() {
        updateStatus();
        setInterval(updateStatus, 60000);
    });
})();

// Espera a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {

    // ── SELECTOR DE IDIOMA ──
    const langBtn      = document.getElementById("langBtn");
    const langDropdown = document.getElementById("langDropdown");

    if (langBtn && langDropdown) {
        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle("open");
        });

        document.addEventListener("click", () => {
            langDropdown.classList.remove("open");
        });

        langDropdown.querySelectorAll(".lang-option").forEach(btn => {
            btn.addEventListener("click", () => {
                const lang = btn.dataset.lang;
                localStorage.setItem("calsilvinoLang", lang);
                applyTranslations(lang);
                langDropdown.classList.remove("open");
            });
        });

        const currentLang = localStorage.getItem("calsilvinoLang") || "es";
        langDropdown.querySelectorAll(".lang-option").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.lang === currentLang);
        });
    }

    // TRANSPARENT HERO HEADER
    const headerEl = document.querySelector("header");
    const bannerEl = document.querySelector(".home-banner");

    if (headerEl && bannerEl) {
        headerEl.classList.add("hero-mode");

        const onScroll = () => {
            const bannerBottom = bannerEl.getBoundingClientRect().bottom;
            if (bannerBottom <= headerEl.offsetHeight) {
                headerEl.classList.remove("hero-mode");
            } else {
                headerEl.classList.add("hero-mode");
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
    }

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

        if (text === "inicio" || text === "inici" || text === "início" || text === "home") {
            link.addEventListener("click", () => {
                closeNav();
                window.location.href = "index.html";
            });
        }

        if (text === "menú" || text === "menu" || text === "carta") {
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

    // BOTÓN NAV (Reservar) — versión desktop
    const navBtn = document.querySelector(".nav-btn");
    if (navBtn) {
        navBtn.addEventListener("click", () => {
            window.location.href = "contacto.html";
        });
    }

    // BOTÓN VER MENÚ (now an anchor, kept for backwards compat)
    const menuBtn = document.querySelector(".home-menu-button");
    if (menuBtn && menuBtn.tagName === "BUTTON") {
        menuBtn.addEventListener("click", () => {
            window.location.href = "menu.html";
        });
    }

    // BOTÓN CTA RESERVA (menú) — now an anchor, kept for backwards compat
    const ctaBtn = document.querySelector(".menu-cta-btn");
    if (ctaBtn && ctaBtn.tagName === "BUTTON") {
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
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const btn     = form.querySelector('button[type="submit"]');
            const msgEl   = document.getElementById("reservaMsg");
            const original = btn ? btn.textContent : '';

            if (btn) { btn.disabled = true; btn.textContent = '⏳ Enviando...'; }

            try {
                const res  = await fetch('/.netlify/functions/submit-reserva', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre:   this.nombre.value.trim(),
                        telefono: this.telefono.value.trim(),
                        email:    this.email.value.trim(),
                        personas: this.personas.value,
                        fecha:    this.fecha.value,
                        hora:     this.hora.value,
                    }),
                });
                const data = await res.json();

                if (res.ok && data.success) {
                    if (msgEl) {
                        msgEl.textContent = '✅ ¡Reserva enviada! Recibirás un correo de confirmación en breve.';
                        msgEl.className   = 'reserva-msg success';
                    }
                    form.reset();
                } else {
                    if (msgEl) {
                        msgEl.textContent = '❌ ' + (data.error || 'Error al enviar la reserva.');
                        msgEl.className   = 'reserva-msg error';
                    }
                }
            } catch {
                if (msgEl) {
                    msgEl.textContent = '❌ Error de conexión. Inténtalo de nuevo.';
                    msgEl.className   = 'reserva-msg error';
                }
            } finally {
                if (btn) { btn.disabled = false; btn.textContent = original; }
            }
        });
    }

    // LEGAL CHECKBOX — prevent unchecking
    const legalCheck = document.getElementById('legalCheck');
    if (legalCheck) {
        legalCheck.addEventListener('click', e => e.preventDefault());
        legalCheck.addEventListener('change', e => { legalCheck.checked = true; });
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

