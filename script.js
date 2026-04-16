// ── MODAL LEGAL ──
function showLegalPopup(e) {
    e.preventDefault();
    document.getElementById("legalModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLegalModal() {
    document.getElementById("legalModal").classList.remove("active");
    document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLegalModal();
});

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
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day   = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    function addDays(date, n) {
        const d = new Date(date);
        d.setDate(d.getDate() + n);
        return d;
    }

    function isAndorraHoliday(date) {
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const y = date.getFullYear();

        const fixed = [
            [1,  1],
            [1,  6],
            [3, 14],
            [5,  1],
            [8, 15],
            [9,  8],
            [11, 1],
            [12, 8],
            [12, 25],
            [12, 26],
        ];

        for (const [fm, fd] of fixed) {
            if (m === fm && d === fd) return true;
        }

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
        const dow     = now.getDay();
        const holiday = isAndorraHoliday(now);
        const hm      = now.getHours() * 60 + now.getMinutes();

        const effectiveDow = holiday ? (dow === 2 ? 0 : dow) : dow;

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

        const sOpen      = textEl.dataset.open            || 'Obert';
        const sClosed    = textEl.dataset.closed          || 'Tancat';
        const sClosesAt  = textEl.dataset.closesAt        || 'Tanca a les';
        const sOpensAt   = textEl.dataset.opensAt         || 'Obre a les';
        const sOpensTmrw = textEl.dataset.opensTomorrowAt || 'Obre demà a les';
        const sHoliday   = textEl.dataset.holiday         || 'Festiu';

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

    window.updateStatus = updateStatus;

    document.addEventListener('DOMContentLoaded', function() {
        updateStatus();
        setInterval(updateStatus, 60000);
    });
})();

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
    }

    // TRANSPARENT HERO HEADER
    const headerEl = document.querySelector("header");
    const bannerEl = document.querySelector(".home-banner");

    if (headerEl && bannerEl) {
        const logoImg = headerEl.querySelector('.logo');
        const setLogo = (heroMode) => {
            if (!logoImg) return;
            logoImg.src = heroMode ? '/images/logoWhite.webp' : '/images/logo.webp';
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

    document.querySelectorAll("nav a").forEach(link => {
        link.addEventListener("click", closeNav);
    });

    // CARRUSEL HOME
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
                alert(phoneBtn.dataset.alert || 'Utilitza el teu telèfon mòbil per trucar 📞\n\nNúmero: +376 840 720');
            }
        });
    }

});
