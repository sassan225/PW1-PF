  document.addEventListener("DOMContentLoaded", function () {
    // --------------------- PESTAÑAS MENU ---------------------
    const tabs = document.querySelectorAll(".top-menu li");

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        document.querySelectorAll("main section").forEach(sec => sec.classList.add("hidden"));
        document.querySelectorAll("main > div:not([id='text-carousel']):not([class*='carousel']):not([class='parrafo-container'])")
          .forEach(div => div.style.display = "none");

        if (i === 0) {
          document.getElementById("home").classList.remove("hidden");
          document.getElementById("estadisticas").style.display = "block";
          document.getElementById("news").style.display = "block";
          document.getElementById("player-ranking").style.display = "block";
        } else if (i === 1) {
          document.getElementById("meta").classList.remove("hidden");
          if (document.getElementById("meta-heroes-body").children.length === 1) {
            cargarMetaHeroes();
            cargarMetaItems();
            cargarMetaItemsTop();
          }
        } else if (i === 2) {
          document.getElementById("heroes").classList.remove("hidden");
          if (allHeroes.length === 0) cargarHeroes();
        } else if (i === 3) {
          document.getElementById("players").classList.remove("hidden");
        }
      });
    });

   // Menú hamburguesa
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.getElementById('player-search');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
    }
  });

  // Login y Sign Up del menú móvil
  document.getElementById('mobile-login')?.addEventListener('click', () => {
    document.getElementById('modal-login').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
    mobileMenu.classList.remove('active');
  });

  document.getElementById('mobile-signup')?.addEventListener('click', () => {
    document.getElementById('modal-signup').classList.remove('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');
    mobileMenu.classList.remove('active');
  });

  // BOTÓN "BUSCAR" DEL MENÚ MÓVIL → muestra la barra de búsqueda
  document.getElementById('mobile-search')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // evita que se cierre el menú al hacer clic en el botón

    // Mostramos la barra de búsqueda como un panel superior
    searchContainer.classList.add('mobile-active');
    searchInput.focus(); // abre el teclado automáticamente

    // Cerramos el menú hamburguesa
    mobileMenu.classList.remove('active');

    // Cuando el usuario termine de buscar (pierde foco o presiona Enter), ocultamos la barra
    const hideSearchBar = () => {
      searchContainer.classList.remove('mobile-active');
      searchInput.value = ''; // opcional: limpiar el input
    };

    searchInput.addEventListener('blur', hideSearchBar, { once: true });
    searchBtn.addEventListener('click', hideSearchBar, { once: true });

    // También se oculta si presiona Enter
    searchInput.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        hideSearchBar();
      }
    }, { once: true });
  });
}

// --------------------- LOGIN / SIGNUP CON AUTO-LOGIN Y MENÚ DE USUARIO ---------------------

function loginUser(username) {
  localStorage.setItem('loggedInUser', username);
  updateAuthUI();
}

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  updateAuthUI();
}

function updateAuthUI() {
  const loggedUser = localStorage.getItem('loggedInUser');

  // Desktop: botón principal (id="btn-login")
  const desktopLoginBtn = document.getElementById('btn-login');
  const desktopSignupBtn = document.getElementById('btn-signup');

  // Limpiamos cualquier evento viejo
  if (desktopLoginBtn) {
    desktopLoginBtn.onclick = null;
  }

  if (loggedUser) {
    if (desktopLoginBtn) {
      desktopLoginBtn.textContent = loggedUser;
      desktopLoginBtn.classList.remove('login-btn');
      desktopLoginBtn.classList.add('user-btn');
      // Evento que abre el menú desplegable
      desktopLoginBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) dropdown.classList.toggle('hidden');
      };
    }
    if (desktopSignupBtn) desktopSignupBtn.style.display = 'none';
  } else {
    if (desktopLoginBtn) {
      desktopLoginBtn.textContent = 'Log In';
      desktopLoginBtn.classList.add('login-btn');
      desktopLoginBtn.classList.remove('user-btn');
      desktopLoginBtn.onclick = () => openModal(modalLogin);
    }
    if (desktopSignupBtn) desktopSignupBtn.style.display = 'inline-block';
  }

  // Menú desplegable desktop
  const userDropdown = document.getElementById('user-dropdown');
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      logoutUser();
      if (userDropdown) userDropdown.classList.add('hidden');
    };
  }

  // Móvil
  const mobileUserSection = document.getElementById('mobile-user-section');
  const mobileUsername = document.getElementById('mobile-username');
  const mobileLogout = document.getElementById('mobile-logout');
  const mobileLoginBtn = document.getElementById('mobile-login');
  const mobileSignupBtn = document.getElementById('mobile-signup');

  if (loggedUser) {
    if (mobileUserSection) {
      mobileUserSection.classList.remove('hidden');
      if (mobileUsername) mobileUsername.textContent = loggedUser;
      if (mobileLogout) mobileLogout.onclick = logoutUser;
    }
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
    if (mobileSignupBtn) mobileSignupBtn.style.display = 'none';
  } else {
    if (mobileUserSection) mobileUserSection.classList.add('hidden');
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
    if (mobileSignupBtn) mobileSignupBtn.style.display = 'block';
  }

  // Cerrar menú desplegable al clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-btn') && !e.target.closest('#user-dropdown')) {
      document.getElementById('user-dropdown')?.classList.add('hidden');
    }
  });
}

// Sign Up (auto-login)
document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const username = e.target.username.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;

  if (username && email && password.length >= 6) {
    localStorage.setItem('user_' + username, JSON.stringify({ email, password }));
    loginUser(username);
    alert('¡Cuenta creada! Ya estás logueado como ' + username);
    closeModals();
  } else {
    alert('Por favor completa todos los campos correctamente.');
  }
});

// Log In
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const userInput = e.target.user.value.trim();
  const password = e.target.password.value;

  const stored = localStorage.getItem('user_' + userInput);
  if (stored) {
    const userData = JSON.parse(stored);
    if (userData.password === password) {
      loginUser(userInput);
      alert('¡Bienvenido de nuevo, ' + userInput + '!');
      closeModals();
    } else {
      alert('Contraseña incorrecta.');
    }
  } else {
    alert('Usuario no encontrado.');
  }
});

// Actualizar UI al cargar y al cambiar tamaño de ventana
updateAuthUI();
window.addEventListener('resize', updateAuthUI);
    

    // HOME al cargar
    document.getElementById("home")?.classList.remove("hidden");
    document.getElementById("estadisticas").style.display = "block";
    document.getElementById("news").style.display = "block";
    document.getElementById("player-ranking").style.display = "block";

    // --------------------- CARRUSEL INFINITO ---------------------
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    let slideWidth = slides[0].offsetWidth + 10;
    let index = 0;

    slides.forEach(slide => track.appendChild(slide.cloneNode(true)));
    const originalSlidesCount = slides.length;

    function moveCarousel() {
      track.style.transition = "transform 0.5s ease";
      track.style.transform = "translateX(-" + (index * slideWidth) + "px)";
      if (index >= originalSlidesCount) {
        setTimeout(() => { track.style.transition = "none"; index = 0; track.style.transform = "translateX(0px)"; }, 500);
      }
      if (index < 0) {
        setTimeout(() => { track.style.transition = "none"; index = originalSlidesCount - 1; track.style.transform = "translateX(-" + index * slideWidth + "px)"; }, 500);
      }
    }

    nextBtn.addEventListener("click", () => { index++; moveCarousel(); });
    prevBtn.addEventListener("click", () => { index--; moveCarousel(); });
    setInterval(() => { index++; moveCarousel(); }, 3000);
    window.addEventListener("resize", () => { slideWidth = slides[0].offsetWidth + 10; moveCarousel(); });

    // --------------------- CARRUSEL DE FRASES ---------------------
    const textSlides = document.querySelectorAll(".text-slide");
    let currentText = 0;
    function nextTextSlide() {
      textSlides[currentText].classList.remove("active");
      currentText = (currentText + 1) % textSlides.length;
      textSlides[currentText].classList.add("active");
    }
    setInterval(nextTextSlide, 4000);

    // --------------------- ESTADISTICAS HEROES ---------------------
    const statsContainer = document.getElementById('stats-container');
    fetch('https://api.opendota.com/api/heroStats')
      .then(res => res.json())
      .then(data => {
        const topHeroes = data.slice(0, 20);
        topHeroes.forEach(hero => {
          const heroId = hero.name.replace('npc_dota_hero_', '');
          const winrate = hero.pro_pick ? (hero.pro_win / hero.pro_pick * 100) : 0;
          const pickrate = hero.pro_pick ? (hero.pro_pick / data.reduce((sum,h) => sum + h.pro_pick,0) * 100) : 0;

          const heroCard = document.createElement('div');
          heroCard.classList.add('hero-stat');
          heroCard.innerHTML = `
            <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/heroes/${heroId}_full.png" alt="${hero.localized_name}">
            <h3>${hero.localized_name}</h3>
            <p>Winrate: ${winrate.toFixed(2)}%</p>
            <p>Pickrate: ${pickrate.toFixed(2)}%</p>
          `;
          statsContainer.appendChild(heroCard);
        });
      })
      .catch(err => console.error("Error cargando héroes:", err));

    // --------------------- NOTICIAS ---------------------
    const newsContainer = document.getElementById("news-container");
    const noticias = [
      { title: "Nuevo parche 7.35c lanzado", description: "Cambios en héroes, items y balance general del juego.", url: "https://www.dota2.com/patches/" },
      { title: "Torneo internacional 2025: Equipos confirmados", description: "Los equipos top del mundo confirmaron su participación.", url: "https://www.dota2.com/esports/" },
      { title: "Guía rápida: Cómo usar los nuevos héroes", description: "Descubre tips y estrategias de los héroes más recientes.", url: "https://www.dotabuff.com/heroes" },
      { title: "Evento especial de Halloween", description: "Objetos, misiones y recompensas temáticas.", url: "https://www.dota2.com/events/" },
      { title: "Balance de objetos en el último parche", description: "Se ajustaron costos y estadísticas de varios items.", url: "https://www.dota2.com/patches/" },
      { title: "Top 5 héroes más usados esta semana", description: "Estadísticas globales de winrate y pickrate.", url: "https://www.dotabuff.com/heroes" },
      { title: "Nuevo set de Arcana disponible", description: "Consigue skins exclusivas en la tienda de Dota 2.", url: "https://www.dota2.com/store/" },
      { title: "Torneos locales de Dota 2", description: "Inscripciones abiertas para competir y ganar premios.", url: "https://www.dota2.com/esports/" },
      { title: "Actualización de la interfaz de juego", description: "Mejoras visuales y optimización de rendimiento.", url: "https://www.dota2.com/patches/" },
      { title: "Cambios en habilidades de héroes", description: "Algunos héroes recibieron buffs y nerfs importantes.", url: "https://www.dotabuff.com/heroes" },
      { title: "Evento de invierno 2025", description: "Misiones temáticas, cofres y recompensas especiales.", url: "https://www.dota2.com/events/" },
      { title: "Nuevo tutorial para principiantes", description: "Aprende a jugar Dota 2 desde cero con consejos prácticos.", url: "https://www.dota2.com/learn" },
      { title: "Actualización del cliente de Dota 2", description: "Optimización de red y reducción de bugs.", url: "https://www.dota2.com/patches/" },
      { title: "Liga profesional DPC: Resultados de la semana", description: "Revisa los últimos resultados y estadísticas de los equipos.", url: "https://www.dota2.com/esports/" },
      { title: "Héroe destacado del mes", description: "Conoce las estrategias y build recomendadas.", url: "https://www.dotabuff.com/heroes" }
    ];
    noticias.forEach(n => {
      const card = document.createElement("div");
      card.classList.add("news-card");
      card.innerHTML = `<h3>${n.title}</h3><p>${n.description}</p><a href="${n.url}" target="_blank">Leer más</a>`;
      newsContainer.appendChild(card);
    });

    // --------------------- RANKING JUGADORES ---------------------
    const container = document.getElementById("players-container");
    const topPlayersMock = [
      { name: "SMASH 🥇", rankLeaderboardRank: 1, rating: 9500, winRate: 0.75, matchCount: 1200 },
      { name: "WISPER 🥈", rankLeaderboardRank: 2, rating: 9400, winRate: 0.72, matchCount: 1180 },
      { name: "ANA    🥉", rankLeaderboardRank: 3, rating: 9300, winRate: 0.70, matchCount: 1150 },
      { name: "STRIKER", rankLeaderboardRank: 4, rating: 9200, winRate: 0.68, matchCount: 1120 },
      { name: "PHOENIX", rankLeaderboardRank: 5, rating: 9100, winRate: 0.66, matchCount: 1100 },
      { name: "BLITZ", rankLeaderboardRank: 6, rating: 9050, winRate: 0.65, matchCount: 1080 },
      { name: "NOVA", rankLeaderboardRank: 7, rating: 9000, winRate: 0.64, matchCount: 1065 },
      { name: "SHADOW", rankLeaderboardRank: 8, rating: 8950, winRate: 0.63, matchCount: 1050 },
      { name: "FROST", rankLeaderboardRank: 9, rating: 8900, winRate: 0.62, matchCount: 1030 },
      { name: "VORTEX", rankLeaderboardRank: 10, rating: 8850, winRate: 0.61, matchCount: 1020 }
    ];
    

    container.innerHTML = "";
    topPlayersMock.forEach(p => {
      const row = document.createElement("div");
      row.classList.add("ranking-row");
      row.innerHTML = `
        <div class="col">${p.name}</div>
        <div class="col">${p.rankLeaderboardRank}</div>
        <div class="col">${p.rating}</div>
        <div class="col">${(p.winRate*100).toFixed(1)}%</div>
        <div class="col">${p.matchCount}</div>
      `;
      container.appendChild(row);
    });

    //Api de yotube para los videos de dota 2

  const API_KEY = "AIzaSyBwFqWpybhG4KGaU6KnqLpN0WktpjAO-3M";
  const query = "Dota 2";
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=6&key=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("videos-container");
      data.items.forEach(video => {
        const videoDiv = document.createElement("div");
        videoDiv.classList.add("video-card");
        videoDiv.innerHTML = `
          <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <h4>${video.snippet.title}</h4>
          </a>
        `;
        container.appendChild(videoDiv);
      });
    });

   // --------------------- LOGIN / SIGNUP MODALS (funciones básicas) ---------------------
const overlay = document.getElementById('modal-overlay');
const modalLogin = document.getElementById('modal-login');
const modalSignup = document.getElementById('modal-signup');

// Función para abrir modal
function openModal(modalEl) {
  overlay.classList.add('active');
  overlay.classList.remove('hidden');
  modalEl.classList.add('active');
  modalEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Cerrar modal
function closeModals() {
  overlay.classList.remove('active');
  overlay.classList.add('hidden');
  modalLogin.classList.remove('active');
  modalLogin.classList.add('hidden');
  modalSignup.classList.remove('active');
  modalSignup.classList.add('hidden');
  document.body.style.overflow = '';
}

// Cerrar con botón X, clic fuera o Escape
document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModals));
overlay.addEventListener('click', closeModals);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModals();
});

// Cambiar entre login y signup
document.querySelectorAll('[data-switch]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-switch');
    if (target === 'signup') {
      modalLogin.classList.remove('active');
      modalLogin.classList.add('hidden');
      modalSignup.classList.remove('hidden');
      modalSignup.classList.add('active');
    } else if (target === 'login') {
      modalSignup.classList.remove('active');
      modalSignup.classList.add('hidden');
      modalLogin.classList.remove('hidden');
      modalLogin.classList.add('active');
    }
  });
});

// Abrir modales desde TODOS los botones (barra superior + menú móvil)
document.querySelectorAll('.login-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(modalLogin));
});

document.querySelectorAll('.signup-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(modalSignup));
});

// Submit simulado
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Login simulado.');
  closeModals();
});

document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('Signup simulado.');
  closeModals();
});
    // ---------------------  VECTORES DE META ---------------------
    const metaHeroesMock = [
      { name: "npc_dota_hero_spirit_breaker",    localized_name: "Spirit Breaker",    pickrate: 18.4, winrate: 54.8 },
      { name: "npc_dota_hero_beastmaster",       localized_name: "Beastmaster",       pickrate: 16.2, winrate: 55.1 },
      { name: "npc_dota_hero_muerta",            localized_name: "Muerta",          pickrate: 15.7, winrate: 53.9 },
      { name: "npc_dota_hero_shadow_fiend",      localized_name: "Shadow Fiend",      pickrate: 14.3, winrate: 52.7 },
      { name: "npc_dota_hero_phantom_assassin", localized_name: "Phantom Assassin",   pickrate: 13.8, winrate: 53.4 },
      { name: "npc_dota_hero_lina",              localized_name: "Lina",              pickrate: 12.9, winrate: 51.9 },
      { name: "npc_dota_hero_invoker",           localized_name: "Invoker",            pickrate: 12.5, winrate: 52.3 },
      { name: "npc_dota_hero_terrorblade",       localized_name: "Terrorblade",        pickrate: 11.8, winrate: 54.2 },
      { name: "npc_dota_hero_wisp",        localized_name: "Windrunner",         pickrate: 11.5, winrate: 51.6 },
      { name: "npc_dota_hero_spectre",          localized_name: "Spectre",            pickrate: 11.1, winrate: 52.1 },
      { name: "npc_dota_hero_crystal_maiden",    localized_name: "Crystal Maiden",     pickrate: 10.8, winrate: 50.5 },
      { name: "npc_dota_hero_axe",              localized_name: "Axe",               pickrate: 10.4, winrate: 51.8 },
      { name: "npc_dota_hero_tiny",             localized_name: "Tiny",               pickrate: 10.1, winrate: 53.0 },
      { name: "npc_dota_hero_pudge",            localized_name: "Pudge",              pickrate: 9.9,  winrate: 49.7 },
      { name: "npc_dota_hero_queenofpain",      localized_name: "Queen of Pain",      pickrate: 9.6,  winrate: 52.6 }
    ];

    const metaItemsMock = [
      { id: "black_king_bar",        name: "Black King Bar",        pickrate: 42.1, winrate: 56.3 },
      { id: "blink",                 name: "Blink Dagger",         pickrate: 38.7, winrate: 53.8 },
      { id: "ultimate_scepter",      name: "Aghanim's Scepter",   pickrate: 35.2, winrate: 54.1 },
      { id: "manta",                name: "Manta Style",          pickrate: 28.9, winrate: 55.7 },
      { id: "desolator",            name: "Desolator",           pickrate: 26.4, winrate: 54.9 },
      { id: "silver_edge",           name: "Silver Edge",          pickrate: 24.1, winrate: 53.2 },
      { id: "satanic",              name: "Satanic",             pickrate: 22.8, winrate: 58.1 },
      { id: "butterfly",             name: "Butterfly",            pickrate: 21.5, winrate: 57.3 },
      { id: "heart",               name: "Heart of Tarrasque",   pickrate: 20.1, winrate: 59.0 },
      { id: "travel_boots",          name: "Boots of Travel",      pickrate: 19.7, winrate: 56.8 }
    ];

    const metaItemsTopMock = [
      { hero: "Spirit Breaker", item: "Black King Bar",       pickrate: 68.2, winrate: 58.9 },
      { hero: "Beastmaster",   item: "ultimate_scepter",   pickrate: 72.1, winrate: 60.2 },
      { hero: "Muerta",       item: "Desolator",           pickrate: 65.4, winrate: 57.8 },
      { hero: "Shadow Fiend",  item: "Black King Bar",       pickrate: 70.1, winrate: 56.5 },
      { hero: "Phantom Assassin", item: "Desolator",         pickrate: 74.3, winrate: 59.1 },
      { hero: "Lina",        item: "cyclone",       pickrate: 62.8, winrate: 55.9 },
      { hero: "Terrorblade",   item: "Manta",          pickrate: 81.2, winrate: 61.3 },
      { hero: "Windranger",   item: "Maelstrom",           pickrate: 58.7, winrate: 54.2 },
      { hero: "Invoker",       item: "ultimate_scepter",   pickrate: 69.5, winrate: 57.8 },
      { hero: "Spectre",      item: "Radiance",            pickrate: 55.1, winrate: 58.6 }
    ];

    // --------------------- FUNCIONES DE META  ---------------------
    function cargarMetaHeroes() {
      const tbody = document.getElementById("meta-heroes-body");
      tbody.innerHTML = "";

      metaHeroesMock.forEach((h, i) => {
        let id = h.name.replace("npc_dota_hero_", "");
        if (id === "windrunner") id = "windranger";
        if (id === "shadow_fiend") id = "nevermore";
        if (id === "queenofpain") id = "queenofpain";

        const cambio = (Math.random() * 6 - 3).toFixed(2);
        const sube = cambio > 0;

        tbody.innerHTML += `
          <tr>
            <td style="color:#e63946;font-weight:bold">${i+1}</td>
            <td style="display:flex;align-items:center;gap:10px;">
              <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png" 
                  style="width:52px;height:29px;border-radius:6px;border:2px solid #444;">
              <strong>${h.localized_name}</strong>
            </td>
            <td style="color:#a8dadc">${h.pickrate}%</td>
            <td style="color:#4ade80;font-weight:bold">${h.winrate}%</td>
            <td style="color:${sube?'#4ade80':'#f87171'}">${sube?'+' : ''}${cambio}%</td>
            <td style="font-size:1.6rem">${sube ? '📉' : '📈'}</td>
          </tr>`;
      });
    }

    function cargarMetaItems() {
      const tbody = document.getElementById("meta-items-body");
      tbody.innerHTML = "";

      metaItemsMock.forEach((item, i) => {
        const cambio = (Math.random() * 8 - 4).toFixed(2);
        const sube = cambio > 0;

        tbody.innerHTML += `
          <tr>
            <td style="color:#e63946;font-weight:bold">${i+1}</td>
            <td style="display:flex;align-items:center;gap:10px;">
              <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item.id}.png" 
                  style="width:44px;height:33px;border-radius:6px;">
              ${item.name}
            </td>
            <td style="color:#a8dadc">${item.pickrate}%</td>
            <td style="color:#4ade80;font-weight:bold">${item.winrate}%</td>
            <td style="color:${sube?'#4ade80':'#f87171'}">${sube?'+' : ''}${cambio}%</td>
            <td style="font-size:1.6rem">${sube ? '📉' : '📈'}</td>
          </tr>`;
      });
    }

    function cargarMetaItemsTop() {
      const tbody = document.getElementById("meta-items-top-body");
      tbody.innerHTML = "";

      metaItemsTopMock.forEach((data, i) => {
        tbody.innerHTML += `
          <tr>
            <td style="color:#e63946;font-weight:bold">${i+1}</td>
            <td>${data.hero}</td>
            <td style="display:flex;align-items:center;gap:10px;">
              <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${data.item.toLowerCase().replace(/ /g,'_').replace(/'/g,'')}.png" 
                  style="width:44px;height:33px;border-radius:6px;">
              ${data.item}
            </td>
            <td style="color:#a8dadc">${data.pickrate}%</td>
            <td style="color:#4ade80;font-weight:bold">${data.winrate}%</td>
          </tr>`;
      });
    }

    // --------------------- PESTAÑA HÉROES ---------------------
    let allHeroes = [];

    async function cargarHeroes() {
      const grid = document.getElementById("heroes-grid");
      grid.innerHTML = "<p style='grid-column:1/-1;text-align:center;padding:80px;color:#e63946;font-size:2rem;'>Cargando 124 héroes legendarios...</p>";

      try {
        const res = await fetch('https://api.opendota.com/api/heroes');
        allHeroes = await res.json();
        renderHeroes(allHeroes);

        // Buscador
        document.getElementById("hero-search").addEventListener("input", (e) => {
          const term = e.target.value.toLowerCase();
          const filtrados = allHeroes.filter(h => h.localized_name.toLowerCase().includes(term));
          renderHeroes(filtrados);
        });
      } catch (e) {
        grid.innerHTML = "<p style='color:#e63946;text-align:center;padding:80px;'>Error de conexión. Recarga.</p>";
      }
    }

    function renderHeroes(heroesList) {
      const grid = document.getElementById("heroes-grid");
      grid.innerHTML = "";

      heroesList.forEach(h => {
        let id = h.name.replace("npc_dota_hero_", "");
        const fix = { "windranger": "windrunner", "shadow_fiend": "nevermore", "queenofpain": "queenofpain", "wisp": "io" };
        if (fix[id]) id = fix[id];

        const card = document.createElement("div");
        card.className = "hero-card";
        card.innerHTML = `
          <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}.png" 
              onerror="this.src='https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/antimage.png'">
          <h3>${h.localized_name}</h3>
        `;
        card.onclick = () => abrirDetalleHeroe(h);
        grid.appendChild(card);
      });
    }

    function abrirDetalleHeroe(hero) {
      let id = hero.name.replace("npc_dota_hero_", "");
      const fix = { "windranger": "windrunner", "shadow_fiend": "nevermore", "queenofpain": "queenofpain", "wisp": "io" };
      if (fix[id]) id = fix[id];

      // CARGAR DATOS REALES
      fetch('https://api.opendota.com/api/heroStats')
        .then(r => r.json())
        .then(data => {
          const stats = data.find(h => h.name === hero.name);

          const winrate = stats ? ((stats["7_win"] / stats["7_pick"]) * 100 || 50).toFixed(1) : "50.0";
          const pickrate = stats ? ((stats["7_pick"] / 500000) * 100 || 10).toFixed(1) : "10.0";

          // Ítems más usados (mock realista por héroe)
          const itemsPorHeroe = {
            "npc_dota_hero_lina": ["blink", "aghanims_scepter", "black_king_bar", "travel_boots", "ultimate_scepter"],
            "npc_dota_hero_invoker": ["ultimate_scepter", "blink", "scythe_of_vyse", "refresher", "octarine_core"],
            "npc_dota_hero_spirit_breaker": ["black_king_bar", "silver_edge", "ultimate_scepter", "assault", "moon_shard"],
            "npc_dota_hero_muerta": ["desolator", "black_king_bar", "satanic", "manta", "butterfly"],
            "npc_dota_hero_phantom_assassin": ["desolator", "black_king_bar", "satanic", "abyssal_blade", "butterfly"],
            "npc_dota_hero_terrorblade": ["manta", "satanic", "butterfly", "skadi", "travel_boots"],
            "npc_dota_hero_shadow_fiend": ["black_king_bar", "satanic", "silver_edge", "butterfly", "aghanims_scepter"]
          };

          const items = itemsPorHeroe[hero.name] || ["black_king_bar", "blink", "ultimate_scepter", "travel_boots", "butterfly"];

          // Counters y aliados
          const counters = ["Axe", "Lion", "Shadow Shaman", "Bristleback", "Undying"];
          const aliados = ["Ogre Magi", "Crystal Maiden", "Io", "Dazzle", "Oracle"];

          document.getElementById("hero-detail").innerHTML = `
            <div style="text-align:center;padding:50px;">
              <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}_full.png" 
                  style="max-width:500px;border-radius:30px;border:8px solid #e63946;box-shadow:0 0 80px rgba(230,57,70,0.9);">
              <h2 style="font-size:5rem;margin:40px 0;color:#e63946;text-shadow:0 0 30px #e63946;">
                ${hero.localized_name}
              </h2>

              <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:35px;margin:60px 0;">
                <div style="background:#222;padding:30px;border-radius:25px;">
                  <strong style="font-size:3.5rem;color:#4ade80">${winrate}%</strong><br>
                  <span style="font-size:1.6rem;color:#aaa;">Winrate (Divine+ 7 días)</span>
                </div>
                <div style="background:#222;padding:30px;border-radius:25px;">
                  <strong style="font-size:3.5rem;color:#a8dadc">${pickrate}%</strong><br>
                  <span style="font-size:1.6rem;color:#aaa;">Pickrate</span>
                </div>
              </div>

              <h3 style="font-size:2.8rem;margin:60px 0 30px;color:#e63946;">Ítems más usados</h3>
              <div style="display:flex;justify-content:center;gap:30px;flex-wrap:wrap;margin-bottom:60px;">
                ${items.map(item => `
                  <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/${item}.png" 
                      title="${item.replace(/_/g,' ').toUpperCase()}" 
                      style="width:100px;height:75px;border-radius:18px;border:4px solid #444;box-shadow:0 0 20px rgba(0,0,0,0.8);">
                `).join('')}
              </div>

              <div style="display:flex;justify-content:center;gap:80px;flex-wrap:wrap;">
                <div>
                  <h3 style="font-size:2.5rem;color:#f87171;margin-bottom:25px;">Counters fuertes</h3>
                  ${counters.map(c => `<div style="background:#400;padding:15px 30px;border-radius:15px;margin:10px 0;font-size:1.3rem;font-weight:bold;">${c}</div>`).join('')}
                </div>
                <div>
                  <h3 style="font-size:2.5rem;color:#4ade80;margin-bottom:25px;">Mejores aliados</h3>
                  ${aliados.map(a => `<div style="background:#040;padding:15px 30px;border-radius:15px;margin:10px 0;font-size:1.3rem;font-weight:bold;">${a}</div>`).join('')}
                </div>
              </div>

              <h3 style="font-size:2.8rem;margin:70px 0 35px;color:#e63946;">Build recomendada (Divine+)</h3>
              <div style="background:#222;padding:40px;border-radius:25px;max-width:900px;margin:0 auto;font-size:1.4rem;">
                <p><strong>Starting:</strong> tango, branches×3, quelling_blade, magic_stick, faerie_fire</p>
                <p><strong>Early Game:</strong> power_treads, magic_wand, blink_dagger</p>
                <p><strong>Core Items:</strong> black_king_bar, ${items[2] || "aghanims_scepter"}, desolator</p>
                <p><strong>Late Game:</strong> butterfly, satanic, abyssal_blade, moon_shard</p>
              </div>
            </div>
          `;
          document.getElementById("hero-modal").classList.remove("hidden");
        })
        .catch(() => {
          // Si falla la API
          document.getElementById("hero-detail").innerHTML = `
            <div style="text-align:center;padding:50px;">
              <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${id}_full.png" style="max-width:500px;border-radius:30px;border:8px solid #e63946;">
              <h2 style="font-size:5rem;margin:40px 0;color:#e63946;">${hero.localized_name}</h2>
              <p style="font-size:2rem;color:#aaa;">Cargando datos reales...</p>
            </div>
          `;
          document.getElementById("hero-modal").classList.remove("hidden");
        });
    }

    // Cerrar modal
    document.querySelector(".close-modal")?.addEventListener("click", () => {
      document.getElementById("hero-modal").classList.add("hidden");
    });

    document.getElementById("hero-modal")?.addEventListener("click", (e) => {
      if (e.target === document.getElementById("hero-modal")) {
        document.getElementById("hero-modal").classList.add("hidden");
      }
    });

    // CARGAR AL ENTRAR A LA PESTAÑA
    document.querySelector(".top-menu li:nth-child(3)").addEventListener("click", () => {
      if (allHeroes.length === 0) cargarHeroes();
    });
  });

    document.querySelector(".close-modal")?.addEventListener("click", () => {
      document.getElementById("hero-modal").classList.add("hidden");
    });

    document.getElementById("hero-modal")?.addEventListener("click", (e) => {
      if (e.target === document.getElementById("hero-modal")) {
        document.getElementById("hero-modal").classList.add("hidden");
      }
    });

    // CARGAR HÉROES AL ENTRAR A LA PESTAÑA
    document.querySelector(".top-menu li:nth-child(3)").addEventListener("click", () => {
      if (allHeroes.length === 0) cargarHeroes();
    });
  // ==================== TOP 20 JUGADORES PRO 2025 ====================
  const top20Players = [
    { rank: 1,  name: "Yatoro",          team: "Team Spirit",      mmr: 13240, winrate: 68.4,  signature: "Phantom Assassin",  kda: "5.8" },
    { rank: 2,  name: "Ana",             team: "OG",               mmr: 13180, winrate: 67.9,  signature: "Terrorblade",       kda: "6.2" },
    { rank: 3,  name: "Wisper",          team: "Beastcoast",       mmr: 13050, winrate: 66.8,  signature: "Beastmaster",       kda: "4.9" },
    { rank: 4,  name: "Collapse",        team: "Team Spirit",      mmr: 12990, winrate: 69.1,  signature: "Magnus",            kda: "5.5" },
    { rank: 5,  name: "Faith_bian",      team: "Azure Ray",        mmr: 12920, winrate: 67.2,  signature: "Mars",              kda: "5.1" },
    { rank: 6,  name: "NothingToSay",    team: "PSG.LGD",          mmr: 12880, winrate: 66.5,  signature: "Puck",              kda: "7.1" },
    { rank: 7,  name: "Ame",             team: "Xtreme Gaming",    mmr: 12840, winrate: 65.9,  signature: "Spectre",           kda: "6.0" },
    { rank: 8,  name: "Quinn",           team: "Gaimin Gladiators",mmr: 12810, winrate: 67.0,  signature: "Leshrac",           kda: "6.8" },
    { rank: 9,  name: "Watson",          team: "Entity",           mmr: 12780, winrate: 66.3,  signature: "Broodmother",      kda: "5.7" },
    { rank: 10, name: "Malr1ne",         team: "Falcons",          mmr: 12750, winrate: 68.0,  signature: "Storm Spirit",      kda: "7.4" },
    { rank: 11, name: "LarI",            team: "Team Spirit",      mmr: 12720, winrate: 67.7,  signature: "Ember Spirit",      kda: "6.9" },
    { rank: 12, name: "SumaiL",          team: "Team Falcons",     mmr: 12690, winrate: 65.5,  signature: "Shadow Fiend",      kda: "6.5" },
    { rank: 13, name: "Nisha",           team: "Liquid",           mmr: 12660, winrate: 66.1,  signature: "Invoker",           kda: "7.0" },
    { rank: 14, name: "Ceb",             team: "OG (coach/player)",mmr: 12630, winrate: 65.8,  signature: "Tidehunter",        kda: "4.8" },
    { rank: 15, name: "Cr1t-",           team: "Shopify Rebellion",mmr: 12600, winrate: 66.4,  signature: "Earth Spirit",      kda: "5.3" },
    { rank: 16, name: "Torontotokyo",    team: "BetBoom Team",     mmr: 12580, winrate: 65.2,  signature: "Pangolier",         kda: "6.1" },
    { rank: 17, name: "bzm",             team: "Liquid",           mmr: 12550, winrate: 66.0,  signature: "Tiny",              kda: "6.7" },
    { rank: 18, name: "Skiter",          team: "Tundra Esports",   mmr: 12520, winrate: 65.7,  signature: "Lifestealer",       kda: "5.9" },
    { rank: 19, name: "23savage",       team: "Aurora",           mmr: 12490, winrate: 64.9,  signature: "Morphling",         kda: "6.3" },
    { rank: 20, name: "Pure",            team: "Tundra Esports",   mmr: 12460, winrate: 65.3,  signature: "Luna",              kda: "6.4" }
  ];

  function cargarJugadores() {
    const grid = document.getElementById("players-grid");
    grid.innerHTML = "";

    // Links reales de Liquipedia (actualizados 2025)
    const liquipediaLinks = {
      yatoro: "https://liquipedia.net/dota2/Yatoro",
      ana: "https://liquipedia.net/dota2/Ana",
      wisper: "https://liquipedia.net/dota2/Wisper",
      collapse: "https://liquipedia.net/dota2/Collapse",
      faithbian: "https://liquipedia.net/dota2/Faith_bian",
      nothingtosay: "https://liquipedia.net/dota2/NothingToSay",
      ame: "https://liquipedia.net/dota2/Ame",
      quinn: "https://liquipedia.net/dota2/Quinn",
      watson: "https://liquipedia.net/dota2/Watson",
      malr1ne: "https://liquipedia.net/dota2/Malr1ne",
      lari: "https://liquipedia.net/dota2/Larl",
      sumail: "https://liquipedia.net/dota2/SumaiL",
      nisha: "https://liquipedia.net/dota2/Nisha",
      ceb: "https://liquipedia.net/dota2/Ceb",
      "crit": "https://liquipedia.net/dota2/Cr1t-",
      torontotokyo: "https://liquipedia.net/dota2/Torontotokyo",
      bzm: "https://liquipedia.net/dota2/Bzm",
      skiter: "https://liquipedia.net/dota2/Skiter",
      "23savage": "https://liquipedia.net/dota2/23savage",
      pure: "https://liquipedia.net/dota2/Pure"
    };

    top20Players.forEach(player => {
      const card = document.createElement("div");
      card.className = "player-card";

      const fotoNombre = player.name.toLowerCase().replace(/[^a-z0-9]/g, "");

      card.innerHTML = `
        <div class="rank-badge">#${player.rank}</div>
        <img src="./imagenes/jugadores/${fotoNombre}.jpg" 
            alt="${player.name}"
            onerror="this.src='https://i.imgur.com/6mF9b8v.jpg'">

        <div class="player-info">
          <h3>${player.name}</h3>
          <div class="team">${player.team}</div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <strong>${player.mmr}</strong>
              <div class="stat-label">MMR</div>
            </div>
            <div class="stat-item">
              <strong>${player.winrate}%</strong>
              <div class="stat-label">Winrate</div>
            </div>
            <div class="stat-item">
              <strong>${player.kda}</strong>
              <div class="stat-label">K/D/A</div>
            </div>
            <div class="stat-item">
              <strong>${player.signature}</strong>
              <div class="stat-label">Héroe favorito</div>
            </div>
          </div>
        </div>
      `;

      // HACEMOS LA TARJETA CLICKEABLE
      card.style.cursor = "pointer"; // manito
      card.title = `Ver perfil de ${player.name} en Liquipedia`; // tooltip

      card.addEventListener("click", () => {
        window.open(liquipediaLinks[fotoNombre], "_blank");
      });

      grid.appendChild(card);
    });
  }

  // CARGA AUTOMÁTICA cuando entras a la pestaña Jugadores
  document.querySelector(".top-menu li:nth-child(4)").addEventListener("click", () => {
    if (document.getElementById("players-grid").children.length === 0) {
      cargarJugadores();
    }
  });
  // ==================== MOTOR DE BÚSQUEDA GLOBAL DE JUGADORES ====================

  const searchInput = document.getElementById("player-search");
  const searchBtn = document.getElementById("search-btn");

  // Lista de jugadores con sus datos para buscar (usa los mismos que ya tienes)
  const jugadoresBuscables = [
    { name: "Yatoro",          steamid: "136829594",  dotabuff: "196874345", aliases: ["yatoro", "yatoro~", "illya", "yatorogod"] },
    { name: "Ana",             steamid: "10366616",   dotabuff: "86745912",  aliases: ["ana", "anathan"] },
    { name: "Wisper",          steamid: "11142019",   dotabuff: "11142019",  aliases: ["wisper", "wisper~", "adrian"] },
    { name: "Collapse",        steamid: "302214028",  dotabuff: "302214028", aliases: ["collapse", "magomed"] },
    { name: "Faith_bian",      steamid: "118134220",  dotabuff: "118134220", aliases: ["faith_bian", "faithbian", "zhang"] },
    { name: "NothingToSay",    steamid: "135656964",  dotabuff: "135656964", aliases: ["nts", "nothingtosay", "cheng"] },
    { name: "Ame",               steamid: "125581247",  dotabuff: "125581247", aliases: ["ame", "wang"] },
    { name: "Quinn",           steamid: "152962063",  dotabuff: "152962063", aliases: ["quinn", "quinn callahan"] },
    { name: "Watson",          steamid: "168282617",  dotabuff: "168282617", aliases: ["watson", "alimzhan"] },
    { name: "Malr1ne",         steamid: "202397251",  dotabuff: "202397251", aliases: ["malr1ne", "malrine", "pma"] },
    { name: "LarI",            steamid: "302372247",  dotabuff: "302372247", aliases: ["larl", "lar1", "denis"] },
    { name: "SumaiL",          steamid: "111620041",  dotabuff: "111620041", aliases: ["sumail", "suma1l", "king"] },
    { name: "Nisha",           steamid: "117421042",  dotabuff: "117421042", aliases: ["nisha", "michal"] },
    { name: "Ceb",             steamid: "100058428",  dotabuff: "100058428", aliases: ["ceb", "sebastien"] },
    { name: "Cr1t-",           steamid: "25907144",   dotabuff: "25907144",  aliases: ["cr1t", "crit", "andreas"] },
    { name: "Torontotokyo",    steamid: "171691200",  dotabuff: "171691200", aliases: ["torontotokyo", "alexander"] },
    { name: "bzm",             steamid: "167881429",  dotabuff: "167881429", aliases: ["bzm", "bozhidar"] },
    { name: "Skiter",          steamid: "117483894",  dotabuff: "117483894", aliases: ["skiter", "oliver"] },
    { name: "23savage",        steamid: "192813017",  dotabuff: "192813017", aliases: ["23savage", "nuengnara"] },
    { name: "Pure",            steamid: "261575978",  dotabuff: "261575978", aliases: ["pure", "ivan"] }
  ];

  // Función para buscar jugador
  function buscarJugador() {
    let query = searchInput.value.trim().toLowerCase();

    if (query === "") {
      alert("Escribe un nombre, apodo o SteamID");
      return;
    }

    // Buscar coincidencia
    const encontrado = jugadoresBuscables.find(j => 
      j.aliases.includes(query) || 
      j.name.toLowerCase() === query || 
      j.steamid === query || 
      j.dotabuff === query
    );

    if (encontrado) {
      // Si está en el Top 20 → ir a la sección y resaltar tarjeta
      const tabs = document.querySelectorAll(".top-menu li");
      tabs[3].click(); // hace click en "Jugadores"

      setTimeout(() => {
        const tarjeta = document.querySelector(`.player-card h3`);
        if (tarjeta && tarjeta.textContent.toLowerCase() === encontrado.name.toLowerCase()) {
          tarjeta.closest(".player-card").scrollIntoView({ behavior: "smooth", block: "center" });
          tarjeta.closest(".player-card").style.boxShadow = "0 0 40px #e63946";
          tarjeta.closest(".player-card").style.transform = "scale(1.08)";
          setTimeout(() => {
            tarjeta.closest(".player-card").style.boxShadow = "";
            tarjeta.closest(".player-card").style.transform = "";
          }, 2000);
        }
      }, 300);

    } else {
      // Si no está en el Top 20 → abrir Dotabuff con el SteamID o nombre
      let url = "";
      if (/^\d+$/.test(query) && query.length >= 8) {
        // Es un SteamID o AccountID
        url = `https://dotabuff.com/players/${query}`;
      } else {
        // Es un nombre → buscamos en Dotabuff
        url = `https://dotabuff.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(query)}`;
      }
      window.open(url, "_blank");
    }
  }

  // Eventos del buscador
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarJugador();
  });

  searchBtn.addEventListener("click", buscarJugador);

  // BONUS: que el input se vea pro cuando está activo
  searchInput.addEventListener("focus", () => {
    searchInput.style.boxShadow = "0 0 20px rgba(230,57,70,0.6)";
    searchInput.style.borderColor = "#e63946";
  });
  searchInput.addEventListener("blur", () => {
    searchInput.style.boxShadow = "";
    searchInput.style.borderColor = "";
  });
