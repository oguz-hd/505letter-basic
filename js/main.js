/* Yardımcı: JSON dosyalarını getirir */
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (e) {
    console.error('JSON yükleme hatası:', e);
    throw e;
  }
}

/* Yardımcı: JSON verisini sunucuya kaydetmeyi dener (backend gerek) */
async function saveJSON(url, data) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data, null, 2) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

/* Yardımcı: URL parametre değerini döndürür */
function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/* Yardımcı: Film detay sayfasına gider */
function navigateToMovie(movieId) {
  window.location.href = `movie.html?id=${movieId}`;
}

/* Liste: Filmleri sayfaya basar */
function renderFilms(films) {
  const filmsContainer = document.getElementById('films-container');
  if (!filmsContainer) return;
  filmsContainer.innerHTML = '';
  if (!films || films.length === 0) {
    filmsContainer.innerHTML = '<div class="empty-state"><p>Film bulunamadı.</p></div>';
    return;
  }
  films.forEach(film => filmsContainer.appendChild(createFilmCard(film)));
}

/* Kart: Film kartı oluşturur */
function createFilmCard(film) {
  const card = document.createElement('div');
  card.className = 'film-card';
  card.addEventListener('click', () => navigateToMovie(film.id));

  const posterContainer = document.createElement('div');
  posterContainer.className = 'film-poster-container';

  const poster = document.createElement('img');
  poster.className = 'film-poster';
  poster.src = film.poster || 'https://via.placeholder.com/200x300/1A1A1A/F8F6F1?text=No+Poster';
  poster.alt = film.title;
  poster.loading = 'lazy';
  poster.referrerPolicy = 'no-referrer';
  poster.onerror = function () { this.src = 'https://via.placeholder.com/200x300/1A1A1A/F8F6F1?text=No+Poster'; };

  const ratingBadge = document.createElement('div');
  ratingBadge.className = 'film-rating-badge';
  ratingBadge.textContent = (film.rating ?? 0).toFixed(1);

  posterContainer.appendChild(poster);
  posterContainer.appendChild(ratingBadge);

  const info = document.createElement('div');
  info.className = 'film-info';

  const title = document.createElement('h3');
  title.className = 'film-title';
  title.textContent = film.title;

  const meta = document.createElement('div');
  meta.className = 'film-meta';
  const year = document.createElement('span');
  year.className = 'film-year';
  year.textContent = film.year;
  meta.appendChild(year);

  const descriptionPreview = document.createElement('div');
  descriptionPreview.className = 'film-description-preview';
  if (film.description) descriptionPreview.textContent = film.description;

  const genres = document.createElement('div');
  genres.className = 'film-genres';
  if (Array.isArray(film.genre)) {
    film.genre.slice(0, 3).forEach(g => { const t = document.createElement('span'); t.className = 'film-genre-tag'; t.textContent = g; genres.appendChild(t); });
    if (film.genre.length > 3) { const m = document.createElement('span'); m.className = 'film-genre-tag'; m.textContent = `+${film.genre.length - 3}`; genres.appendChild(m); }
  }

  info.appendChild(title);
  info.appendChild(meta);
  if (film.description) info.appendChild(descriptionPreview);
  info.appendChild(genres);

  card.appendChild(posterContainer);
  card.appendChild(info);
  return card;
}

/* Arama: Filmleri ada/türe/oyuncuya göre filtreler */
let allFilms = [];
function searchFilms(query) {
  const q = (query || '').toLowerCase().trim();
  if (q === '') { renderFilms(allFilms); return; }
  const filtered = allFilms.filter(f =>
    (f.title || '').toLowerCase().includes(q) ||
    (Array.isArray(f.genre) && f.genre.some(g => (g || '').toLowerCase().includes(q))) ||
    (Array.isArray(f.cast) && f.cast.some(c => (c || '').toLowerCase().includes(q)))
  );
  renderFilms(filtered);
}

/* Hata: Listeleme hatasını gösterir */
function displayError(message) {
  const filmsContainer = document.getElementById('films-container');
  if (filmsContainer) filmsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

/* Popüler: Puanı yüksek filmleri listeler */
function renderPopularFilms(films) {
  const el = document.getElementById('popular-films-container');
  if (!el) return;
  const items = [...films].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  el.innerHTML = '';
  if (items.length === 0) { el.innerHTML = '<div class="empty-state"><p>Popüler film bulunamadı.</p></div>'; return; }
  items.forEach(f => el.appendChild(createFilmCard(f)));
}

/* Son Çıkanlar: Son yıllardaki filmleri listeler */
function renderLatestFilms(films) {
  const el = document.getElementById('latest-films-container');
  if (!el) return;
  const year = new Date().getFullYear();
  let items = [...films].filter(f => (f.year ?? 0) >= year - 5).sort((a, b) => b.year - a.year);
  if (items.length === 0) items = [...films].sort((a, b) => b.year - a.year);
  el.innerHTML = '';
  if (items.length === 0) { el.innerHTML = '<div class="empty-state"><p>Son çıkan film bulunamadı.</p></div>'; return; }
  items.forEach(f => el.appendChild(createFilmCard(f)));
}

/* Başlık: Arama kutusunu yönetir */
function initHeaderSearch() {
  const input = document.getElementById('header-search-input');
  if (!input) return;
  const page = window.location.pathname.split('/').pop() || 'index.html';
  let t;
  input.addEventListener('input', e => {
    const v = e.target.value.trim();
    clearTimeout(t);
    if (page === 'index.html' || page === '') {
      t = setTimeout(() => { if (typeof searchFilms === 'function') searchFilms(v); }, 100);
    }
  });
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const v = e.target.value.trim();
      if (!v) return;
      if (page === 'index.html' || page === '') {
        if (typeof searchFilms === 'function') searchFilms(v);
      } else {
        window.location.href = `index.html?search=${encodeURIComponent(v)}`;
      }
    }
  });
}

/* Başlık: Aktif menü bağlantısını işaretler */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) link.classList.add('active');
    else link.classList.remove('active');
  });
}

/* Yorum: Tarih metnini biçimlendirir */
function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/* Yorum: Yorumları yükler */
async function loadComments(movieId) {
  try {
    const comments = await fetchJSON('data/comments.json');
    return comments.filter(c => c.movie_id === movieId);
  } catch (e) { console.error('Yorum yükleme hatası:', e); return []; }
}

/* Yorum: Yorumları sayfaya basar */
function renderComments(comments) {
  const el = document.getElementById('comments-list');
  if (!el) return;
  el.innerHTML = '';
  if (!comments || comments.length === 0) { el.innerHTML = '<div class="empty-state"><p>Henüz yorum yapılmamış.</p></div>'; return; }
  const sorted = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach(c => el.appendChild(createCommentElement(c)));
}

/* Yorum: Tek yorum elemanı oluşturur */
function createCommentElement(comment) {
  const div = document.createElement('div');
  div.className = 'comment-item';
  const header = document.createElement('div');
  header.className = 'comment-header';
  const username = document.createElement('div');
  username.className = 'comment-username';
  username.textContent = comment.username;
  const date = document.createElement('div');
  date.className = 'comment-date';
  date.textContent = formatDate(comment.date);
  header.appendChild(username); header.appendChild(date);
  const text = document.createElement('div');
  text.className = 'comment-text';
  text.textContent = comment.comment;
  div.appendChild(header); div.appendChild(text);
  return div;
}

/* Yorum: Yeni yorum ekler (backend yoksa fallback kullanır) */
async function addComment(movieId, username, commentText) {
  try {
    const comments = await fetchJSON('data/comments.json');
    const newComment = { movie_id: movieId, username: username.trim(), comment: commentText.trim(), date: new Date().toISOString().split('T')[0] };
    comments.push(newComment);
    try { await saveJSON('data/comments.json', comments); }
    catch { localStorage.setItem('comments_fallback', JSON.stringify(comments)); window.commentsCache = comments; }
    return true;
  } catch (e) { console.error('Yorum ekleme hatası:', e); return false; }
}

/* Yorum: Sunucu + fallback yorumları birleştirir */
async function getComments(movieId) {
  let server = [];
  let fallback = [];
  try { server = await fetchJSON('data/comments.json'); } catch { /* yoksay */ }
  const ls = localStorage.getItem('comments_fallback');
  if (ls) { try { fallback = JSON.parse(ls); } catch { /* yoksay */ } }
  if (window.commentsCache) fallback = window.commentsCache;
  const map = new Map();
  server.forEach(c => map.set(`${c.movie_id}-${c.username}-${c.date}-${c.comment}`, c));
  fallback.forEach(c => map.set(`${c.movie_id}-${c.username}-${c.date}-${c.comment}`, c));
  return Array.from(map.values()).filter(c => c.movie_id === movieId);
}

/* Yorum: Form gönderimini bağlar */
function setupCommentForm(movieId) {
  const form = document.getElementById('comment-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('comment-username');
    const t = document.getElementById('comment-text');
    const username = u?.value.trim();
    const text = t?.value.trim();
    if (!username || !text) { alert('Lütfen kullanıcı adı ve yorum metnini doldurun.'); return; }
    const ok = await addComment(movieId, username, text);
    if (ok) { u.value = ''; t.value = ''; const comments = await getComments(movieId); renderComments(comments); showMessage('Yorumunuz başarıyla eklendi!', 'success'); }
    else { showMessage('Yorum eklenirken bir hata oluştu.', 'error'); }
  });
}

/* Yorum: Kullanıcıya mesaj gösterir */
function showMessage(message, type) {
  const existing = document.querySelector('.message');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = `message ${type === 'success' ? 'success-message' : 'error-message'}`;
  div.textContent = message;
  const form = document.getElementById('comment-form');
  if (form && form.parentNode) form.parentNode.insertBefore(div, form);
  setTimeout(() => div.remove(), 5000);
}

/* Detay: ID ile filmi yükler */
async function loadFilm(movieId) {
  try { const films = await fetchJSON('data/films.json'); return films.find(f => f.id === movieId) || null; }
  catch (e) { console.error('Film yükleme hatası:', e); return null; }
}

/* Detay: Film detaylarını sayfaya basar */
function renderFilmDetails(film) {
  if (!film) { displayFilmError('Film bulunamadı.'); return; }
  document.title = `${film.title} - 505letter`;
  const posterContainer = document.getElementById('movie-poster');
  if (posterContainer) {
    const img = document.createElement('img');
    img.className = 'movie-poster-large';
    img.src = film.poster || 'https://via.placeholder.com/300x450?text=No+Poster';
    img.alt = film.title;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.onerror = function () { this.src = 'https://via.placeholder.com/300x450?text=No+Poster'; };
    posterContainer.innerHTML = '';
    posterContainer.appendChild(img);
  }
  const titleEl = document.getElementById('movie-title'); if (titleEl) titleEl.textContent = film.title;
  const yearEl = document.getElementById('movie-year'); if (yearEl) yearEl.textContent = film.year;
  const ratingEl = document.getElementById('movie-rating'); if (ratingEl) ratingEl.textContent = `★ ${film.rating}`;
  const genresEl = document.getElementById('movie-genres');
  if (genresEl) { genresEl.innerHTML = ''; film.genre.forEach(g => { const s = document.createElement('span'); s.className = 'genre-tag'; s.textContent = g; genresEl.appendChild(s); }); }
  const descEl = document.getElementById('movie-description'); if (descEl) descEl.textContent = film.description;
  const castEl = document.getElementById('movie-cast');
  if (castEl) {
    const list = document.createElement('div');
    list.className = 'cast-list';
    film.cast.forEach(a => { const m = document.createElement('span'); m.className = 'cast-member'; m.textContent = a; list.appendChild(m); });
    castEl.innerHTML = ''; castEl.appendChild(list);
  }
}

/* Detay: Film bulunamazsa hata gösterir */
function displayFilmError(message) {
  const container = document.querySelector('.movie-detail');
  if (container) container.innerHTML = `<div class="error-message">${message}</div>`;
}

/* Admin: Tüm filmleri yükler */
async function loadAllFilms() {
  try { return await fetchJSON('data/films.json'); } catch (e) { console.error('Film yükleme hatası:', e); return []; }
}

/* Admin: Yeni ID üretir */
function generateNextId(films) { return films.length === 0 ? 1 : Math.max(...films.map(f => f.id)) + 1; }

/* Admin: Virgülle ayrılmış metni diziye çevirir */
function parseCommaSeparated(str) { return (!str || str.trim() === '') ? [] : str.split(',').map(s => s.trim()).filter(Boolean); }

/* Admin: Form verisini doğrular */
function validateFilmForm(d) {
  const e = [];
  if (!d.title || d.title.trim() === '') e.push('Film başlığı gereklidir.');
  if (!d.year || isNaN(d.year) || d.year < 1888 || d.year > new Date().getFullYear() + 1) e.push('Geçerli bir yıl gereklidir.');
  if (!d.genre || d.genre.length === 0) e.push('En az bir tür gereklidir.');
  if (!d.description || d.description.trim() === '') e.push('Film açıklaması gereklidir.');
  if (!d.cast || d.cast.length === 0) e.push('En az bir oyuncu gereklidir.');
  if (!d.rating || isNaN(d.rating) || d.rating < 0 || d.rating > 10) e.push('Geçerli bir puan gereklidir (0-10 arası).');
  if (!d.poster || d.poster.trim() === '') e.push('Poster URL gereklidir.');
  return { valid: e.length === 0, errors: e };
}

/* Admin: Yeni film eklemeyi simüle eder (demo) */
async function addFilm(filmData) {
  try {
    const films = await loadAllFilms();
    const newId = generateNextId(films);
    const newFilm = { id: newId, title: filmData.title.trim(), year: parseInt(filmData.year, 10), genre: filmData.genre, description: filmData.description.trim(), cast: filmData.cast, rating: parseFloat(filmData.rating), poster: filmData.poster.trim(), trailer: filmData.trailer ? filmData.trailer.trim() : '' };
    console.log('Film ekleme devre dışı (demo):', newFilm);
    return true;
  } catch (e) { console.error('Film ekleme hatası:', e); return false; }
}

/* Admin: Kullanıcıya mesaj gösterir */
function showAdminMessage(message, type) {
  const existing = document.querySelector('.admin-message');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.className = `admin-message ${type === 'success' ? 'success-message' : 'error-message'}`;
  div.textContent = message;
  const form = document.getElementById('admin-form');
  if (form && form.parentNode) form.parentNode.insertBefore(div, form);
  if (type === 'error') setTimeout(() => div.remove(), 5000);
}

/* Sayfa: İndeks sayfasını başlatır */
async function initIndexPage() {
  try {
    allFilms = await fetchJSON('data/films.json');
    renderFilms(allFilms);
    const searchQuery = getURLParameter('search');
    if (searchQuery) { setTimeout(() => { searchFilms(searchQuery); const hs = document.getElementById('header-search-input'); if (hs) hs.value = searchQuery; }, 100); }
  } catch (e) { console.error('Filmler yüklenemedi:', e); displayError('Filmler yüklenirken bir hata oluştu.'); }
}

/* Sayfa: Popüler sayfasını başlatır */
async function initPopularPage() { try { const films = await fetchJSON('data/films.json'); renderPopularFilms(films); } catch (e) { const c = document.getElementById('popular-films-container'); if (c) c.innerHTML = '<div class="empty-state"><p>Filmler yüklenirken bir hata oluştu.</p></div>'; } }

/* Sayfa: Son çıkanlar sayfasını başlatır */
async function initLatestPage() { try { const films = await fetchJSON('data/films.json'); renderLatestFilms(films); } catch (e) { const c = document.getElementById('latest-films-container'); if (c) c.innerHTML = '<div class="empty-state"><p>Filmler yüklenirken bir hata oluştu.</p></div>'; } }

/* Sayfa: Film detay sayfasını başlatır */
async function initMovieDetailPage() {
  const idParam = getURLParameter('id');
  if (!idParam) { displayFilmError('Film ID belirtilmedi.'); return; }
  const movieId = parseInt(idParam, 10);
  if (isNaN(movieId)) { displayFilmError('Geçersiz film ID.'); return; }
  const film = await loadFilm(movieId);
  if (!film) { displayFilmError('Film bulunamadı.'); return; }
  renderFilmDetails(film);
  const comments = await getComments(movieId);
  renderComments(comments);
  setupCommentForm(movieId);
}

/* Sayfa: Admin sayfasını başlatır */
function initAdminPage() {
  const form = document.getElementById('admin-form');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
      title: document.getElementById('film-title').value,
      year: document.getElementById('film-year').value,
      genre: parseCommaSeparated(document.getElementById('film-genre').value),
      description: document.getElementById('film-description').value,
      cast: parseCommaSeparated(document.getElementById('film-cast').value),
      rating: document.getElementById('film-rating').value,
      poster: document.getElementById('film-poster').value,
      trailer: document.getElementById('film-trailer') ? document.getElementById('film-trailer').value : ''
    };
    const v = validateFilmForm(data);
    if (!v.valid) { showAdminMessage(v.errors.join(' '), 'error'); return; }
    const ok = await addFilm(data);
    if (ok) { showAdminMessage('Form başarıyla gönderildi! (Demo - veri kaydedilmedi)', 'success'); form.reset(); }
    else { showAdminMessage('Form gönderilirken bir hata oluştu.', 'error'); }
  });
}

/* Sayfa: İletişim formunu bağlar */
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => { e.preventDefault(); alert('Mesajınız alındı! Teşekkür ederiz.'); form.reset(); });
}

/* Önyükleme: Sayfayı algılar ve uygun başlatmayı yapar */
function boot() {
  initHeaderSearch();
  setActiveNavLink();
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === '' || page === 'index.html') initIndexPage();
  else if (page === 'popular.html') initPopularPage();
  else if (page === 'latest.html') initLatestPage();
  else if (page === 'movie.html') initMovieDetailPage();
  else if (page === 'admin.html') initAdminPage();
  else if (page === 'contact.html') initContactPage();
}

/* Olay: DOM yüklendiğinde başlatır */
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
