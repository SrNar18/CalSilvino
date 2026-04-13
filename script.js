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

        const lang = localStorage.getItem('calsilvinoLang') || 'es';
        const t = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};

        const now     = getAndorraNow();
        const dow     = now.getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
        const holiday = isAndorraHoliday(now);
        const hm      = now.getHours() * 60 + now.getMinutes();

        const effectiveDow = holiday ? (dow === 2 ? 0 : dow) : dow;

        // Schedule:
        // Mon(1), Sun(0): 11:00–16:00 only
        // Tue(2): Cerrado
        // Wed(3),Thu(4),Fri(5),Sat(6): 11:00–16:00, 20:00–23:00
        let slots = [];
        if (effectiveDow === 2) {
            slots = [];
        } else if (effectiveDow === 1 || effectiveDow === 0) {
            slots = [{ open: 660, close: 960, closeStr: "16:00" }];
        } else {
            slots = [{ open: 660, close: 960, closeStr: "16:00" }, { open: 1200, close: 1380, closeStr: "23:00" }];
        }

        let openNow    = false;
        let closesAt   = null;
        let nextOpenAt = null;
        let nextOpenTomorrow = false;

        for (const slot of slots) {
            if (hm >= slot.open && hm < slot.close) {
                openNow  = true;
                closesAt = slot.closeStr;
                break;
            }
        }

        if (!openNow) {
            const upcoming = slots.find(s => hm < s.open);
            if (upcoming) {
                nextOpenAt = pad2(Math.floor(upcoming.open / 60)) + ":" + pad2(upcoming.open % 60);
                nextOpenTomorrow = false;
            } else {
                nextOpenAt = "13:00";
                nextOpenTomorrow = true;
            }
        }

        const sOpen      = t['status-open']              || 'Abierto';
        const sClosed    = t['status-closed']             || 'Cerrado';
        const sClosesAt  = t['status-closes-at']          || 'Cierra a las';
        const sOpensAt   = t['status-opens-at']           || 'Abre a las';
        const sOpensTmrw = t['status-opens-tomorrow-at']  || 'Abre mañana a las';
        const sHoliday   = t['status-holiday']            || 'Festivo';

        const holidayPrefix = holiday ? "🎉 " + sHoliday + " · " : "";
        dotEl.className = 'status-dot ' + (openNow ? 'open' : 'closed');

        if (openNow) {
            textEl.textContent = holidayPrefix + sOpen + " · " + sClosesAt + " " + closesAt;
        } else if (effectiveDow === 2) {
            textEl.textContent = sClosed + " · " + sOpensTmrw + " 13:00";
        } else {
            const whenStr = nextOpenTomorrow ? sOpensTmrw : sOpensAt;
            textEl.textContent = holidayPrefix + sClosed + " · " + whenStr + " " + nextOpenAt;
        }
    }

    // Expose globally so language switch can refresh it
    window.updateStatus = updateStatus;

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
                if (typeof window.updateStatus === 'function') window.updateStatus();
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
        const logoImg = headerEl.querySelector('.logo');
        const setLogo = (heroMode) => {
            if (!logoImg) return;
            logoImg.src = heroMode ? '/images/logoWhite.png' : '/images/logo.png';
        };

        headerEl.classList.add("hero-mode");
        setLogo(true);

        const onScroll = () => {
            const bannerBottom = bannerEl.getBoundingClientRect().bottom;
            if (bannerBottom <= headerEl.offsetHeight) {
                headerEl.classList.remove("hero-mode");
                setLogo(false);
            } else {
                headerEl.classList.add("hero-mode");
                setLogo(true);
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

    // LOGO → index
    const logo = document.querySelector(".logo");
    if (logo) {
        logo.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // FECHA — bloquear fechas pasadas
    const fechaInput = document.getElementById('fechaInput');
    if (fechaInput) {
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Andorra' });
        fechaInput.min = today;
        fechaInput.addEventListener('change', function () {
            if (this.value < today) {
                this.value = today;
            }
        });
    }

    // FORMULARIO DE RESERVA — selector de turno
    const turnoSelect = document.getElementById('turnoSelect');
    const horaGroup   = document.getElementById('horaGroup');
    const horaInput   = document.getElementById('horaInput');
    const horaHint    = document.getElementById('horaHint');

    const TURNO_CONFIG = {
        mediodia: { min: '11:00', max: '16:00', label: 'Horario mediodía: 11:00–16:00' },
        noche:    { min: '20:00', max: '23:00', label: 'Horario noche: 20:00–23:00' },
    };

    if (turnoSelect) {
        turnoSelect.addEventListener('change', function () {
            const cfg = TURNO_CONFIG[this.value];
            if (cfg) {
                horaGroup.style.display = 'block';
                horaInput.min     = cfg.min;
                horaInput.max     = cfg.max;
                horaInput.value   = '';
                horaInput.required = true;
                horaHint.textContent = cfg.label;
            } else {
                horaGroup.style.display = 'none';
                horaInput.required = false;
            }
        });
    }

    // Validación de personas > 8
    const personasInput = document.getElementById('personasInput');
    const personasHint  = document.getElementById('personasHint');
    if (personasInput && personasHint) {
        personasInput.addEventListener('input', function () {
            personasHint.style.display = Number(this.value) > 8 ? 'block' : 'none';
        });
        personasHint.style.display = 'none';
    }

    // FORMULARIO DE RESERVA
    const form = document.getElementById("reservaForm");
    if (form) {
        form.addEventListener("submit", async function(e) {
            e.preventDefault();

            const btn      = form.querySelector('button[type="submit"]');
            const msgEl    = document.getElementById("reservaMsg");
            const original = btn ? btn.textContent : '';

            const lang = localStorage.getItem('calsilvinoLang') || 'es';
            const tr = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};

            // Validar hora dentro del rango del turno
            if (horaInput && horaInput.value) {
                const turno = turnoSelect ? turnoSelect.value : '';
                const cfg   = TURNO_CONFIG[turno];
                if (cfg && (horaInput.value < cfg.min || horaInput.value > cfg.max)) {
                    if (msgEl) {
                        msgEl.textContent = (tr['form-error-time'] || '❌ La hora debe estar entre %min% y %max% para el turno seleccionado.').replace('%min%', cfg.min).replace('%max%', cfg.max);
                        msgEl.className   = 'reserva-msg error';
                    }
                    return;
                }
            }

            if (btn) { btn.disabled = true; btn.textContent = tr['form-sending'] || '⏳ Enviando...'; }

            const turnoLabel = turnoSelect && turnoSelect.value === 'noche' ? 'Noche' : 'Mediodía';

            try {
                const mensajeInput = form.querySelector('textarea[name="mensaje"]');
                const res  = await fetch('/.netlify/functions/submit-reserva', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre:   this.nombre.value.trim(),
                        telefono: this.telefono.value.trim(),
                        email:    this.email.value.trim(),
                        personas: this.personas.value,
                        fecha:    this.fecha.value,
                        turno:    turnoLabel,
                        hora:     horaInput ? horaInput.value : '',
                        mensaje:  mensajeInput ? mensajeInput.value.trim() : '',
                    }),
                });

                let data;
                try {
                    data = await res.json();
                } catch {
                    data = {};
                }

                if (res.ok && data.success) {
                    if (msgEl) {
                        msgEl.innerHTML = tr['form-success-html'] || '✅ ¡Reserva enviada! Te confirmaremos en menos de 24 horas.<br><small>¿No recibes respuesta? Llámanos al <a href="tel:+376840720" style="color:#16a34a;">+376 840 720</a></small>';
                        msgEl.className = 'reserva-msg success';
                    }
                    form.reset();
                    horaGroup.style.display = 'none';
                    if (personasHint) personasHint.style.display = 'none';
                } else {
                    if (msgEl) {
                        msgEl.textContent = data.error ? ('❌ ' + data.error) : (tr['form-error-generic'] || '❌ Error al enviar la reserva.');
                        msgEl.className   = 'reserva-msg error';
                    }
                }
            } catch {
                if (msgEl) {
                    msgEl.textContent = tr['form-error-connection'] || '❌ Error de conexión. Inténtalo de nuevo.';
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
                const lang = localStorage.getItem('calsilvinoLang') || 'es';
                const tr = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};
                alert(tr['phone-alert'] || 'Utiliza tu teléfono móvil para llamar 📞\n\nNúmero: +376 840 720');
            }
        });
    }

    // ── AUTO-GROW TEXTAREA ──
    const textarea = document.getElementById('mensajeTextarea');
    if (textarea) {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

});

