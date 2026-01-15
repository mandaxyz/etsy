// script.js – Association Etsy Babeko
//
// Developed by Manda Rajoelisolo
// LinkedIn: https://www.linkedin.com/in/manda-rajoelisolo-972a37344/

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100079921057459";
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".facebook-anywhere").forEach(el => {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => window.open(FACEBOOK_URL, "_blank"));
    });
});

const routes = {
    "/":                  "home",
    "/un-peu-d-histoire": "history",
    "/nos-actions":       "actions",
    "/je-contribue":      "contribute"
};

const tabLinks     = document.querySelectorAll('nav a[data-tab]');
const sidebarLinks = document.querySelectorAll('#sidebar nav a[data-tab]');
const tabContents  = document.querySelectorAll('.tab-content');
const main         = document.querySelector('main');
const header       = document.getElementById('header');

// ====================== Activate tab ======================
function activateTab(tabId, pushState = true) {
    // Remove active states
    tabLinks    .forEach(l => l.classList.remove('active'));
    tabContents .forEach(c => c.classList.remove('active'));
    sidebarLinks.forEach(l => l.classList.remove('active'));

    const link        = document.querySelector(`nav a[data-tab="${tabId}"]`);
    const sidebarLink = document.querySelector(`#sidebar nav a[data-tab="${tabId}"]`);
    const target      = document.getElementById(tabId);

    if (link && target) {
        link       .classList.add('active');
        target     .classList.add('active');
        sidebarLink.classList.add('active');
        main.className = `tab-${tabId}`;

        // Re-trigger hero text slide-in animation
        const heroText = target.querySelector('.hero-text');
        if (heroText) {
            heroText.classList.remove('animate');
            void heroText.offsetWidth; // force reflow
            heroText.classList.add('animate');
        }

        // Update browser URL without reload
        if (pushState) {
            const path = link.getAttribute('href');
            history.pushState({ tab: tabId }, '', path);
        }

        window.scrollTo(0, 0);
    }

    closeSidebar();
}

// ====================== Navigation clicks ======================
tabLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        activateTab(link.dataset.tab);
    });
});

// ====================== Menu button & sidebar ======================

const menuBtns = document.querySelectorAll('header .menu-btn, .sidebar-menu-btn');
const sidebar = document.getElementById('sidebar');

menuBtns.forEach(b => {
    b.addEventListener('click', () => {
        // Toggle sidebar visibility
        sidebar.classList.toggle('active');
        // Toggle .active on all menu buttons
        menuBtns.forEach(b => b.classList.toggle('active'));
    });
});

function closeSidebar() {
    sidebar.classList.remove('active');
    menuBtns.forEach(b => b.classList.remove('active'));
}

// ====================== Long button shadows alignment ======================
function updateLongButtonShadows() {
    const viewportWidth = window.innerWidth;
    const mainLeft = document.querySelector('main').getBoundingClientRect().left;

    document.querySelectorAll('.long-btn').forEach(container => {
        const arrow = container.querySelector('.btn-arrow');
        if (!arrow) return;
        let rightX = arrow.getBoundingClientRect().right - mainLeft - 25;

        rightX = Math.min(rightX, viewportWidth - mainLeft - 40);

        container.style.setProperty('--shadow-offset', `${rightX}px`);
    });
}

// ====================== Live shadow during resize (real-time while dragging!) ======================
let liveResizeRaf = 0;
const startLiveResizeTracking = () => {
    if (liveResizeRaf) cancelAnimationFrame(liveResizeRaf);
    const tick = () => {
        updateLongButtonShadows();
        liveResizeRaf = requestAnimationFrame(tick);
    };
    tick();
};

// When resize starts → track every frame
window.addEventListener('resize', () => {
    startLiveResizeTracking();

    // Stop tracking when user stops resizing (after 150ms of calm)
    clearTimeout(window.resizeEndTimer);
    window.resizeEndTimer = setTimeout(() => {
        cancelAnimationFrame(liveResizeRaf);
        liveResizeRaf = 0;
        updateLongButtonShadows(); // one final perfect update
    }, 150);
});

// ====================== "En savoir plus !" & "Je souhaite contribuer !" & "-->" BUTTONS ======================
document.querySelectorAll('.home_right-arrow-btn_1').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('history'); });
});
document.querySelectorAll('.home_right-arrow-btn_2').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('history'); });
});

document.querySelectorAll('.history_right-arrow-btn_1').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('actions'); });
});
document.querySelectorAll('.history_right-arrow-btn_2').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('actions'); });
});

document.querySelectorAll('.home_contribute-btn').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('contribute'); });
});
/*document.querySelectorAll('.history_contribute-btn').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('contribute'); });
});*/
document.querySelectorAll('.history_learn-more-btn').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('actions'); });
});
document.querySelectorAll('.actions_right-arrow-btn_1').forEach(btn => {
    btn.addEventListener('click', () => { activateTab('contribute'); });
});

// ====================== Back/forward & direct url access ======================
window.addEventListener('popstate', () => {
    const path  = location.pathname;
    const tabId = routes[path] || 'home';
    activateTab(tabId, false);
});

// ====================== Initial load ======================
document.addEventListener('DOMContentLoaded', () => {
    // Determine correct tab from current URL
    const path  = location.pathname;
    const tabId = routes[path] || 'home';
    activateTab(tabId, false);

    // Animate first hero text
    const firstHero = document.querySelector('.tab-content.active .hero-text');
    if (firstHero) firstHero.classList.add('animate');

    // Prevent left-click zoom on hero images (only middle/right-click opens them)
    document.querySelectorAll('.hero-link').forEach(link => {
        link.addEventListener('click', e => {
            if (e.button === 0) e.preventDefault(); // left click
        });
    });

    // Initial shadow alignment
    updateLongButtonShadows();
});

// ====================== Sticky header hide/show ======================
let lastScrollTop = 0;
const delta = 5;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.classList.add('hidden');    // scrolling down
    } else {
        header.classList.remove('hidden'); // scrolling up
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});