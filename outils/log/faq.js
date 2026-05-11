// faq.js — Innovation Hub FAQ logic
// Data is loaded from faq.json at runtime

let FAQ = [];
let currentLang = 'fr';
let currentCat = 'all';
let currentSearch = '';

function getCookie(name) {
  const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(name, value) {
  document.cookie = name + '=' + encodeURIComponent(value) + '; max-age=31536000; path=/; SameSite=Lax';
}
function getInitialLang() {
  const saved = getCookie('faq_lang');
  if (saved === 'fr' || saved === 'en') return saved;
  const browser = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
  return browser.startsWith('fr') ? 'fr' : 'en';
}
function getInitialTheme() {
  const saved = getCookie('faq_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}


function setLang(lang) {
  currentLang = lang;
  setCookie('faq_lang', lang);
  document.documentElement.lang = lang === 'en' ? 'en' : 'fr';

  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = lang === 'en' ? 'FR' : 'EN';

  const heroTitle = document.getElementById('hero-title');
  const heroSub = document.getElementById('hero-sub');
  const searchInput = document.getElementById('search-input');
  const headerSub = document.getElementById('header-sub');
  if (lang === 'en') {
    if (headerSub) headerSub.textContent = 'Innovation Hub';
    heroTitle.textContent = 'Frequently Asked Questions';
    heroSub.textContent = 'Everything you need to know to do your internship at the Innovation Hub.';
    if (searchInput) searchInput.placeholder = 'Search…';
  } else {
    if (headerSub) headerSub.textContent = 'Pôle d\u2019innovation';
    heroTitle.textContent = 'Questions fréquentes';
    heroSub.textContent = "Tout ce qu'il faut savoir pour faire ton stage au Pôle d'innovation.";
    if (searchInput) searchInput.placeholder = 'Rechercher…';
  }

  document.querySelectorAll('[data-fr]').forEach(el => {
    if (lang === 'en' && el.dataset.en) el.textContent = el.dataset.en;
    else el.textContent = el.dataset.fr;
  });

  render();
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.hasAttribute('data-theme') && root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', 'dark');
  }
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? 'ti ti-moon' : 'ti ti-sun';
  setCookie('faq_theme', isDark ? 'light' : 'dark');
}

function filterCat(cat) {
  currentCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
  render();
}

function clearSearch() {
  document.getElementById('search-input').value = '';
  currentSearch = '';
  document.getElementById('clear-btn').style.display = 'none';
  render();
}

function showCopyToast(lang) {
  let toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = lang === 'en' ? 'Link copied!' : 'Lien copié\u00a0!';
  toast.classList.add('visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('visible'), 2000);
}

function copyShareLink(catId) {
  const url = location.href.split('#')[0] + '#' + catId;
  navigator.clipboard.writeText(url).catch(() => {});
  showCopyToast(currentLang);
}

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // strip accent marks
    .replace(/[·'''\-]/g, ' ')        // treat middle dots, apostrophes, hyphens as spaces
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesSearch(item, query) {
  if (!query) return true;
  const words = normalize(query).split(' ').filter(w => w.length > 1);
  if (words.length === 0) return true;
  const haystack = normalize(
    (item.fr.q || '') + ' ' + (item.fr.a || '') + ' ' +
    (item.en.q || '') + ' ' + (item.en.a || '')
  );
  // Match if ALL words are found (AND logic) — tolerant of partial word matches
  return words.every(word => haystack.includes(word));
}

function render() {
  const container = document.getElementById('faq-sections');
  const noResults = document.getElementById('no-results');
  const resultCount = document.getElementById('result-count');
  const cats = ['avant_stage','pendant_stage','outil_journal','evaluation','projets_methodes','chef_equipe','equipes_roles','fichiers_outils','regles_droits','competences_perso'];

  const catLabels = {
    avant_stage:      { fr: 'Avant le stage', en: 'Before the internship' },
    pendant_stage:    { fr: 'Pendant le stage', en: 'During the internship' },
    outil_journal:    { fr: 'Outil de journal', en: 'Log tool' },
    evaluation:       { fr: '\u00c9valuation', en: 'Grading' },
    projets_methodes: { fr: 'Projets & m\u00e9thodes', en: 'Projects & methods' },
    chef_equipe:      { fr: "Chef\u00b7fe d'\u00e9quipe", en: 'Team lead' },
    equipes_roles:    { fr: '\u00c9quipes & communication', en: 'Teams & communication' },
    fichiers_outils:  { fr: 'Fichiers & outils', en: 'Files & tools' },
    regles_droits:    { fr: 'R\u00e8gles & droits', en: 'Rules & rights' },
    competences_perso:{ fr: 'Comp\u00e9tences personnelles', en: 'Personal skills' }
  };

  let totalVisible = 0;
  let html = '';

  const activeCats = currentCat === 'all' ? cats : [currentCat];

  activeCats.forEach(cat => {
    const items = FAQ.filter(item => item.cat === cat && matchesSearch(item, currentSearch));
    if (items.length === 0) return;
    totalVisible += items.length;

    const label = catLabels[cat];
    const heading = currentLang === 'en' ? label.en : (currentLang === 'both' ? `${label.fr} · ${label.en}` : label.fr);

    html += `<section class="faq-section" data-cat="${cat}" id="${cat}">
      <div class="section-header">
        <h2>${heading}</h2>
        <span class="count-badge">${items.length}</span>
        <button class="share-btn" data-cat="${cat}" title="${currentLang === 'en' ? 'Copy link to this section' : 'Copier le lien vers cette section'}" aria-label="${currentLang === 'en' ? 'Copy link' : 'Copier le lien'}">&#x1F517;</button>
      </div>`;

    items.forEach((item, idx) => {
      const id = `faq-${cat}-${idx}`;
      if (currentLang === 'both') {
        html += renderItem(id + '-fr', item.fr, 'fr');
        html += renderItem(id + '-en', item.en, 'en');
      } else {
        const content = currentLang === 'en' ? item.en : item.fr;
        html += renderItem(id, content, null);
      }
    });

    html += `</section>`;
  });

  document.getElementById('count-all').textContent = FAQ.filter(i => matchesSearch(i, currentSearch)).length;
  cats.forEach(cat => {
    const el = document.getElementById('count-' + cat);
    if (el) el.textContent = FAQ.filter(i => i.cat === cat && matchesSearch(i, currentSearch)).length;
  });

  container.innerHTML = html;

  if (totalVisible === 0) {
    noResults.style.display = 'block';
    const noEl = noResults.querySelector('p');
    if (currentLang === 'en') noEl.textContent = 'No results found. Try different keywords.';
    else noEl.textContent = "Aucun résultat trouvé. Essaie d'autres mots-clés.";
    resultCount.style.display = 'none';
  } else {
    noResults.style.display = 'none';
    if (currentSearch) {
      resultCount.style.display = 'block';
      resultCount.textContent = currentLang === 'en'
        ? `${totalVisible} result${totalVisible !== 1 ? 's' : ''} for "${currentSearch}"`
        : `${totalVisible} résultat${totalVisible !== 1 ? 's' : ''} pour « ${currentSearch} »`;
    } else {
      resultCount.style.display = 'none';
    }
  }

  if (currentSearch) {
    container.querySelectorAll('.faq-item').forEach(item => {
      item.classList.add('open');
      item.querySelector('.faq-a').classList.add('visible');
    });
  }
}

function renderItem(id, content, lang) {
  const langTag = lang ? `<span class="faq-lang-tag" style="display:inline-block">${lang.toUpperCase()}</span>` : '';
  return `<div class="faq-item" id="${id}">
    <button class="faq-q" aria-expanded="false">
      ${langTag}
      <span class="faq-q-text">${content.q}</span>
      <i class="ti ti-chevron-down faq-chevron" aria-hidden="true"></i>
    </button>
    <span class="q-share-btn" data-id="${id}" role="button" tabindex="0" title="${currentLang === 'en' ? 'Copy link to this question' : 'Copier le lien vers cette question'}" aria-label="${currentLang === 'en' ? 'Copy link' : 'Copier le lien'}">&#x1F517;</span>
    <div class="faq-a" role="region">${content.a}</div>
  </div>`;
}

function loadAndInit() {
  // Wire all buttons immediately — no data needed for theme/lang toggles
  wireButtons();

  fetch('faq.json')
    .then(r => r.json())
    .then(data => {
      FAQ = data;
      currentLang = getInitialLang();
      setLang(currentLang);
    })
    .catch(err => {
      document.getElementById('faq-content').innerHTML =
        '<p style="padding:40px;color:var(--text-muted)">Unable to load FAQ data. Make sure faq.json is in the same folder.</p>';
      console.error('Failed to load faq.json:', err);
    });
}

function wireButtons() {
  try {
    const initialTheme = getInitialTheme();
    if (initialTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const _icon = document.getElementById('theme-icon');
      if (_icon) _icon.className = 'ti ti-sun';
    }
  } catch(e) {}

  document.getElementById('lang-toggle').addEventListener('click', function() {
    setLang(currentLang === 'fr' ? 'en' : 'fr');
  });

  document.getElementById('theme-btn').addEventListener('click', toggleTheme);
  document.getElementById('clear-btn').addEventListener('click', clearSearch);

  document.getElementById('search-input').addEventListener('input', function() {
    currentSearch = normalize(this.value);
    document.getElementById('clear-btn').style.display = currentSearch ? 'block' : 'none';
    render();
  });

  document.querySelector('.sidebar').addEventListener('click', function(e) {
    const btn = e.target.closest('.cat-btn');
    if (btn) filterCat(btn.dataset.cat);
  });

  document.getElementById('faq-sections').addEventListener('click', function(e) {
    const qShareBtn = e.target.closest('.q-share-btn');
    if (qShareBtn) {
      e.stopPropagation();
      const url = location.href.split('#')[0] + '#' + qShareBtn.dataset.id;
      navigator.clipboard.writeText(url).catch(() => {});
      qShareBtn.classList.add('copied');
      setTimeout(() => qShareBtn.classList.remove('copied'), 1500);
      showCopyToast(currentLang);
      return;
    }
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
      copyShareLink(shareBtn.dataset.cat);
      shareBtn.classList.add('copied');
      setTimeout(() => shareBtn.classList.remove('copied'), 1500);
      return;
    }
    const qBtn = e.target.closest('.faq-q');
    if (qBtn) {
      const item = qBtn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      answer.classList.toggle('visible', !isOpen);
      qBtn.setAttribute('aria-expanded', String(!isOpen));
    }
  });
}

function initApp() {
  // Called after FAQ data is loaded — handles deep links
  if (location.hash) {
    const hash = location.hash.slice(1);
    const validCats = ['avant_stage','pendant_stage','outil_journal','evaluation','projets_methodes','chef_equipe','equipes_roles','fichiers_outils','regles_droits','competences_perso'];
    if (validCats.includes(hash)) {
      filterCat(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (hash.startsWith('faq-')) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.classList.add('open');
          el.querySelector('.faq-a').classList.add('visible');
          el.querySelector('.faq-q').setAttribute('aria-expanded', 'true');
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }
}

// Script is at end of body — DOM is ready, no DOMContentLoaded needed
loadAndInit();